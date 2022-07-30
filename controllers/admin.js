const Role = require("../models/role");
const User = require("../models/user");
const Course = require("../models/course");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.create_admin = async (req, res) => {
  const role = await Role.findOne({ role_id: 1 });

  const password = await bcrypt.hash(req.body.password, saltRounds);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
    role_id: role.role_id,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.create_role = async (req, res) => {
  const role = new Role({
    name: req.body.name,
    role_id: req.body.role_id,
    created_at: Date.now(),
    updated_at: Date.now(),
  });
  try {
    await role.save();
    res.status(201).send(role);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.get_users = async (_req, res) => {
  try {
    const users = await User.find({
      role_id: 1,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.create_course = async (req, res) => {
  const author_id = req.user.user_id;
  if (req.file) {
    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      created_at: Date.now(),
      updated_at: Date.now(),
      author_id: author_id,
      image: req.file.filename,
      price: req.body.price,
      is_active: true,
      is_featured: req.body.is_featured,
      is_free: req.body.is_free,
      is_trending: req.body.is_trending,
    });
    try {
      await course.save();
      res.status(201).send(course);
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    const courseArray = req.body.name.split(" ");
    let imageUrl = "https://via.placeholder.com/470x470?text=";
    for (const element of courseArray) {
      // if this is not last element
      if (courseArray.indexOf(element) !== courseArray.length - 1) {
        imageUrl += `${element}+`;
      } else {
        imageUrl += element;
      }
    }

    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      created_at: Date.now(),
      updated_at: Date.now(),
      author_id: author_id,
      // category_id: req.body.category_id,
      image: imageUrl,
      price: req.body.price,
      is_active: req.body.is_active,
      is_featured: req.body.is_featured,
      is_free: req.body.is_free,
      is_trending: req.body.is_trending,
    });
    try {
      await course.save();
      res.status(201).send(course);
    } catch (err) {
      res.status(400).send(err);
    }
  }
};
