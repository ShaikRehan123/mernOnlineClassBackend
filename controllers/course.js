const Category = require("../models/Category");
const EnrolledCourse = require("../models/EnrolledCourse");
const Course = require("../models/Course");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

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
  // const EnrolledCourseSchema = new Schema({
  //   course: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Course",
  //     required: true,
  //   },
  //   user: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  //   enrolledDate: {
  //     type: Date,
  //     default: Date.now,
  //   },
  //   paidAmount: {
  //     type: Number,
  //     required: true,
  //     default: 0,
  //   },
  //   paymentId: {
  //     type: String,
  //     required: false,
  //   },
  //   // array of objects with lesson id and lesson status
  //   lessonsStatus: [
  //     {
  //       lesson: {
  //         type: Schema.Types.ObjectId,
  //         ref: "Lesson",
  //         required: true,
  //       },
  //       status: {
  //         type: String,
  //         enum: ["not-started", "in-progress", "completed"],
  //         default: "not-started",
  //       },
  //       videoCurrentTime: {
  //         type: Number,
  //         default: 0,
  //         required: false,
  //       },
  //     },
  //   ],
  // });
  // get each course enrolled count
  // sort the courses by enrolled count
  // get the top 10 courses
  // get the course details

  const allCourses = await Course.find({ is_active: true });

  const allEnrolledCourses = await EnrolledCourse.find({});
  const coursesEnrolledCount = [];
  allCourses.forEach((course) => {
    const courseEnrolledCount = allEnrolledCourses.filter(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString()
    ).length;
    coursesEnrolledCount.push({
      course: course,
      enrolledCount: courseEnrolledCount,
    });
  });

  coursesEnrolledCount.sort((a, b) => b.enrolledCount - a.enrolledCount);

  const topTenCourses = coursesEnrolledCount.slice(0, 10);

  res.status(200).json({
    message: "Top 10 courses",
    topTenCourses: topTenCourses,
  });
};
