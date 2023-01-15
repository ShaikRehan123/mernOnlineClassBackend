const Category = require("../models/Category");
const EnrolledCourse = require("../models/EnrolledCourse");
const Course = require("../models/Course");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Lesson = require("../models/Lesson");
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const { razorpayInstance } = require("../lib/lib");
const crypto = require("crypto");

exports.get_all_courses = async (_req, res) => {
  const all_courses = await Course.find({
    is_active: true,
  });

  // get category name
  const courses = await Promise.all(
    all_courses.map(async (course) => {
      const category = await Category.findOne({
        _id: course.category_id,
      });
      return {
        ...course._doc,
        category_name: category.name,
      };
    })
  );

  // get author name
  const courses_with_author = await Promise.all(
    courses.map(async (course) => {
      const author = await User.findOne({
        _id: course.author_id,
      });
      return {
        ...course,
        author_name: author.name,
      };
    })
  );

  if (courses_with_author.length > 0) {
    res.status(200).json({
      message: "Successfully retrieved all courses",
      courses: courses_with_author,
    });
  } else {
    res.status(200).json({
      message: "No courses found",
      courses: [],
    });
  }
};

exports.get_course = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.status(200).json({
      message: "Successfully retrieved course",
      course: course,
    });
  } else {
    res.status(200).json({
      message: "No course found",
    });
  }
};

exports.get_courses_in_category = async (req, res) => {
  try {
    const courses = await Course.find({
      category_id: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: courses,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.course_delete = async (req, res) => {
  const course_id = req.params.id;
  // console.log(course_id);
  try {
    const course = await Course.findById(course_id);

    if (course) {
      await Course.deleteOne({
        _id: course_id,
      });
      const videos_path = path.join(
        __dirname,
        "../public/upload/course_videos/" + course._id
      );
      const image_file_path = path.join(
        __dirname,
        "../public/upload/course_images/" + course.image
      );
      // console.log(image_file_path);
      // console.log(videos_path);

      if (fs.existsSync(videos_path)) {
        fs.rmSync(videos_path, { recursive: true });
      }

      if (
        fs.existsSync(image_file_path) &&
        course.image !== "default-course-image.jpg"
      ) {
        fs.unlinkSync(image_file_path);
      }

      res.status(200).json({
        status: "success",
        message: "Course deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};

exports.topTenCourses = async (req, res) => {
  const user_id = req.query.user_id ? req.query.user_id : "notLoggedIn";

  const allCourses = await Course.find({ is_active: true });

  const allEnrolledCourses = await EnrolledCourse.find({});
  const coursesEnrolledCount = [];

  let UserId;
  let usersCart;

  if (user_id !== "notLoggedIn") {
    UserId = await User.findOne({ _id: user_id });
    usersCart = await Cart.findOne({
      user_id: UserId._id,
    });
  }

  allCourses.forEach((course) => {
    const courseEnrolledCount = allEnrolledCourses.filter(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString()
    ).length;

    const isEnrolled = allEnrolledCourses.some(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString() &&
        enrolledCourse.user.toString() === user_id.toString()
    );

    if (UserId) {
      const course_ids = usersCart ? usersCart.course_ids : [];

      const isAddedToCart = course_ids.some(
        (course_id) => course_id.toString() === course._id.toString()
      );

      coursesEnrolledCount.push({
        ...course._doc,
        enrolledCount: courseEnrolledCount,
        isEnrolled: isEnrolled,
        isAddedToCart: isAddedToCart,
      });
    }
  });

  coursesEnrolledCount.sort((a, b) => b.enrolledCount - a.enrolledCount);

  const topTenCourses = coursesEnrolledCount.slice(0, 10);

  res.status(200).json({
    message: "Top 10 courses",
    topTenCourses: topTenCourses,
  });
};

exports.allCourses = async (req, res) => {
  const user_id = req.query.user_id ? req.query.user_id : "notLoggedIn";

  const allCourses = await Course.find({ is_active: true });

  const allEnrolledCourses = await EnrolledCourse.find({});
  const coursesEnrolledCount = [];

  let UserId;
  let usersCart;

  if (user_id !== "notLoggedIn") {
    UserId = await User.findOne({
      _id: user_id,
    });

    usersCart = await Cart.findOne({
      user_id: UserId._id,
    });
  }

  allCourses.forEach((course) => {
    const courseEnrolledCount = allEnrolledCourses.filter(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString()
    ).length;

    const isEnrolled = allEnrolledCourses.some(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString() &&
        enrolledCourse.user.toString() === user_id.toString()
    );

    if (UserId) {
      const course_ids = usersCart ? usersCart.course_ids : [];

      const isAddedToCart = course_ids.some(
        (course_id) => course_id.toString() === course._id.toString()
      );

      coursesEnrolledCount.push({
        ...course._doc,
        enrolledCount: courseEnrolledCount,
        isEnrolled: isEnrolled,
        isAddedToCart: isAddedToCart,
      });
    }
  });

  coursesEnrolledCount.sort((a, b) => b.enrolledCount - a.enrolledCount);

  res.status(200).json({
    message: "All courses",
    allCourses: coursesEnrolledCount,
  });
};

exports.toggle_active = async (req, res) => {
  const course_id = req.body.course_id;

  try {
    const course = await Course.findById(course_id);

    if (course) {
      const updatedCourse = await Course.updateOne(
        { _id: course_id },
        { $set: { is_active: !course.is_active } }
      );

      res.status(200).json({
        status: "success",
        message: "Course updated",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};

exports.createOrder = async (req, res) => {
  const courseIds = req.body.courseIds;
  const userId = req.user.user_id;

  const user = await User.findById(userId);

  const totalAmount = await Course.find({
    _id: {
      $in: courseIds,
    },
  }).then((courses) => {
    let totalAmount = 0;
    courses.forEach((course) => {
      totalAmount += course.price;
    });
    return totalAmount;
  });

  // console.log(totalAmount);

  const commaSeperatedCourseNames = await Course.find({
    _id: {
      $in: courseIds,
    },
  }).then((courses) => {
    const courseNames = [];
    courses.forEach((course) => {
      courseNames.push(course.name);
    });
    return courseNames.join(", ");
  });

  if (totalAmount !== 0) {
    const order_id = shortid.generate();

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: order_id,
    };

    try {
      const order = await razorpayInstance.orders.create(options);

      const database_order = await Order.create({
        user_id: user._id,
        course_ids: courseIds,
        amount: totalAmount,
        is_paid: false,
        razorpay_order_id: order.id,
        razorpay_payment_id: null,
        razorpay_signature: null,
        created_at: order.created_at,
      });

      res.send({
        message: "Order created",
        status: "success",
        order: order,
        courseNames: commaSeperatedCourseNames,
      });
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message || "Something went wrong",
      });
    }
  } else {
    const database_order = await Order.create({
      user_id: user._id,
      course_ids: courseIds,
      amount: totalAmount,
      is_paid: true,
      razorpay_order_id: "free_course",
      razorpay_payment_id: "free_course",
      razorpay_signature: "free_course",
      created_at: Date.now(),
    });

    const courses = await Course.find({
      _id: {
        $in: database_order.course_ids,
      },
    });

    // console.log(courses);

    courses.forEach(async (course) => {
      const lessons = await Lesson.find({
        course_id: course._id,
      });

      const lessonsStatus = [];

      lessons.forEach((lesson) => {
        lessonsStatus.push({
          lesson: lesson._id,
          status: "not-started",
          videoCurrentTime: 0,
        });
      });

      await EnrolledCourse.create({
        user: user._id,
        course: course._id,
        enrolledDate: Date.now(),
        lessonsStatus: lessonsStatus,
      });
    });

    // remove courses from cart
    const cart = await Cart.findOne({
      user_id: user._id,
    });

    const newCourseIds = cart.course_ids.filter((course_id) => {
      return !courseIds.includes(course_id.toString());
    });

    cart.course_ids = newCourseIds;

    await cart.save();

    res.send({
      message: "Order created",
      status: "success",
      order: "free_course",
      courseNames: commaSeperatedCourseNames,
    });
  }
};

exports.paymentVerification = async (req, res) => {
  // console.log(req.body);

  const combined =
    req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(combined.toString())
    .digest("hex");

  // console.log(req.body);

  if (expectedSignature === req.body.razorpay_signature) {
    const order = await Order.findOne({
      razorpay_order_id: req.body.razorpay_order_id,
    });

    if (order) {
      order.is_paid = true;
      order.razorpay_payment_id = req.body.razorpay_payment_id;
      order.razorpay_signature = req.body.razorpay_signature;
      await order.save();

      const user = await User.findById(order.user_id);

      const courses = await Course.find({
        _id: {
          $in: order.course_ids,
        },
      });

      courses.forEach(async (course) => {
        const lessons = await Lesson.find({
          course_id: course._id,
        });

        const lessonsStatus = [];

        lessons.forEach((lesson) => {
          lessonsStatus.push({
            lesson: lesson._id,
            status: "not-started",
            videoCurrentTime: 0,
          });
        });

        await EnrolledCourse.create({
          user: user._id,
          course: course._id,
          enrolledDate: Date.now(),
          lessonsStatus: lessonsStatus,
        });
      });

      // remove courses from cart
      const cart = await Cart.findOne({
        user_id: user._id,
      });

      const newCourseIds = cart.course_ids.filter((course_id) => {
        return !order.course_ids.includes(course_id.toString());
      });

      cart.course_ids = newCourseIds;

      await cart.save();

      res.redirect(
        `${process.env.FRONTEND_URL}/payment-success?order_id=${req.body.razorpay_order_id}&payment_id=${req.body.razorpay_payment_id}`
      );
    } else {
      res.redirect(
        `${process.env.FRONTEND_URL}/payment-failure?order_id=${req.body.razorpay_order_id}&payment_id=${req.body.razorpay_payment_id}`
      );
    }
  } else {
    res.redirect(
      `${process.env.FRONTEND_URL}/payment-failure?order_id=${req.body.razorpay_order_id}&payment_id=${req.body.razorpay_payment_id}`
    );
  }
};

exports.enrolledCourses = async (req, res) => {
  const userId = req.user.user_id;

  const enrolledCourses = await EnrolledCourse.find({ user: userId })
    .populate("course")
    .populate("user")
    .populate("lessonsStatus.lesson");

  console.log(enrolledCourses);

  const courses = [];

  enrolledCourses.forEach((enrolledCourse) => {
    // get completion status of course by percentage of lessons completed
    let completedLessons = 0;
    let totalLessons = 0;

    enrolledCourse.lessonsStatus.forEach((lessonStatus) => {
      if (lessonStatus.lesson.is_active) {
        if (lessonStatus.status === "completed") {
          completedLessons++;
        }

        if (lessonStatus.status === "in-progress") {
          completedLessons += 0.5;
        }

        totalLessons++;
      }
    });

    const completionPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    courses.push({
      course: enrolledCourse.course,
      completionPercentage: completionPercentage,
    });
  });

  res.send({
    message: "Enrolled courses",
    status: "success",
    enrolledCourses: courses,
  });
};

exports.enrolledCourseLessons = async (req, res) => {
  const userId = req.user.user_id;
  const courseId = req.body.course_id;

  const enrolledCourse = await EnrolledCourse.findOne({
    user: userId,
    course: courseId,
  })
    .populate("course")
    .populate("user")
    .populate("lessonsStatus.lesson");

  if (enrolledCourse) {
    const lessons = [];

    enrolledCourse.lessonsStatus.forEach((lessonStatus) => {
      if (lessonStatus.lesson.is_active) {
        lessons.push({
          lesson: lessonStatus.lesson,
          status: lessonStatus.status,
          videoCurrentTime: lessonStatus.videoCurrentTime,
        });
      }
      // lessons.push({
      //   lesson: lessonStatus.lesson,
      //   status: lessonStatus.status,
      //   videoCurrentTime: lessonStatus.videoCurrentTime,
      // });
    });

    res.send({
      message: "Enrolled course lessons",
      status: "success",
      courseLessons: lessons,
    });
  } else {
    res.send({
      message: "This user might not be enrolled in this course",
      status: "failure",
    });
  }
};

exports.updateVideoCurrentTime = async (req, res) => {
  const userId = req.user.user_id;
  const courseId = req.body.course_id;
  const lessonId = req.body.lesson_id;
  const videoCurrentTime = req.body.video_current_time;
  const videoDuration = req.body.video_duration;

  const enrolledCourse = await EnrolledCourse.findOne({
    user: userId,
    course: courseId,
  })
    .populate("course")
    .populate("user")
    .populate("lessonsStatus.lesson");

  if (enrolledCourse) {
    const lessonsStatus = enrolledCourse.lessonsStatus;
    const lessonStatus = lessonsStatus.find(
      (lessonStatus) =>
        lessonStatus.lesson._id.toString() === lessonId.toString()
    );

    // if lessonStatus.status is not-started, then change it to in-progress\
    if (lessonStatus.status === "not-started") {
      lessonStatus.status = "in-progress";
    }

    // if videoCurrentTime is greater than 90% of videoDuration, then change lessonStatus.status to completed
    if (videoCurrentTime > videoDuration * 0.9) {
      lessonStatus.status = "completed";
    }

    lessonStatus.videoCurrentTime = videoCurrentTime;
    await enrolledCourse.save();
    res.send({
      message: "Video current time updated",
      status: "success",
    });
  } else {
    res.send({
      message: "This user might not be enrolled in this course",
      status: "failure",
    });
  }
};

exports.getLessonCurrentTime = async (req, res) => {
  const userId = req.user.user_id;
  const courseId = req.body.course_id;
  const lessonId = req.body.lesson_id;

  const user = await User.findById(userId);
  const enrolledCourse = await EnrolledCourse.findOne({
    user: user._id,
    course: courseId,
  })
    .populate("course")
    .populate("user")
    .populate("lessonsStatus.lesson");

  if (enrolledCourse) {
    const lessonsStatus = enrolledCourse.lessonsStatus;
    const lessonStatus = lessonsStatus.find(
      (lessonStatus) =>
        lessonStatus.lesson._id.toString() === lessonId.toString()
    );

    res.send({
      message: "Video current time",
      status: "success",
      videoCurrentTime: lessonStatus.videoCurrentTime,
    });
  } else {
    res.send({
      message: "This user might not be enrolled in this course",
      status: "failure",
    });
  }
};

exports.getTeacherDashboardData = async (req, res) => {
  const userId = req.user.user_id;

  const user = await User.findById(userId);
  const courses = await Course.find({ teacher: user._id });
  const enrolledCourses = await EnrolledCourse.find({
    course: { $in: courses.map((course) => course._id) },
  })
    .populate("course")
    .populate("user")
    .populate("lessonsStatus.lesson");
  const totalStudents = enrolledCourses.length;
  const totalCourses = courses.length;
  let totalEarnings = 0;
  let totalWatchTime = 0;

  enrolledCourses.forEach((enrolledCourse) => {
    totalEarnings += enrolledCourse.course.price;
    enrolledCourse.lessonsStatus.forEach((lessonStatus) => {
      if (lessonStatus.lesson.is_active) {
        totalWatchTime += lessonStatus.videoCurrentTime;
      }
    });
  });

  res.send({
    message: "Teacher dashboard data",
    status: "success",
    data: {
      totalStudents: totalStudents,
      totalCourses: totalCourses,
      totalEarnings: totalEarnings,
      totalWatchTime: totalWatchTime,
    },
  });
};
