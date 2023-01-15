const Cart = require("../models/Cart");
const User = require("../models/User");
const Course = require("../models/Course");
// const cartSchema = new Schema({
//   user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   course_ids: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });

exports.addToCart = async (req, res) => {
  console.log(req.user);
  console.log(req.body.course_id);

  const user = User.findById(req.user.user_id);
  const course = Course.findById(req.body.course_id);
  if (user && course) {
    const cart = await Cart.findOne({ user_id: req.user.user_id });
    if (cart) {
      // check if course already in cart
      const courseInCart = cart.course_ids.find(
        (course) => course == req.body.course_id
      );
      if (courseInCart) {
        res.status(200).json({
          status: "error",
          message: "Course already in cart",
        });
      } else {
        cart.course_ids.push(req.body.course_id);
        cart.updated_at = Date.now();
        await cart.save();
        res.status(200).json({
          status: "success",
          message: "Course added to cart",
        });
      }
    } else {
      const newCart = new Cart({
        user_id: req.user.user_id,
        course_ids: [req.body.course_id],
      });
      await newCart.save();
      res.status(200).json({
        status: "success",
        message: "Course added to cart",
      });
    }
  }
};

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user_id: req.user.user_id });
  if (cart) {
    const coursesInCart = await Course.find({
      _id: { $in: cart.course_ids },
    });

    console.log(coursesInCart);

    res.status(200).json({
      status: "success",
      message: "Cart found",
      cartItems: coursesInCart,
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "Cart found",
      cartItems: [],
    });
  }
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user_id: req.user.user_id });
  if (cart) {
    const courseInCart = cart.course_ids.find(
      (course) => course == req.body.course_id
    );
    if (courseInCart) {
      cart.course_ids = cart.course_ids.filter(
        (course) => course != req.body.course_id
      );
      cart.updated_at = Date.now();
      await cart.save();
      res.status(200).json({
        status: "success",
        message: "Course removed from cart",
      });
    } else {
      res.status(200).json({
        status: "error",
        message: "Course not in cart",
      });
    }
  } else {
    res.status(200).json({
      status: "error",
      message: "Cart not found",
    });
  }
};
