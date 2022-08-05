const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

exports.register = async (req, res) => {
  // get the role id from roles collection where role_id is 1
  const role = await Role.findOne({ role_id: 2 });

  const password = await bcrypt.hash(req.body.password, saltRounds);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
    role_id: role.role_id,
  });
  try {
    const newUser = await user.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  res.status(200).json({
    message: "Login successful",
    token: jwt.sign(
      {
        user_id: user._id,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        // expires in  7 days
        expiresIn: "7d",
      }
    ),
    role_id: user.role_id,
    ...user._doc,
  });
};
