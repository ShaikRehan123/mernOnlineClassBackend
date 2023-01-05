const Category = require("../models/Category");

exports.get_all_categories = async (_req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.create_category = async (req, res) => {
  console.log(req.body);
  try {
    const category = new Category({
      name: req.body.name,
      created_at: Date.now(),
      updated_at: Date.now(),
      is_active: true,
    });
    const newCategory = await category.save();
    res.status(201).json({
      status: "success",
      data: newCategory,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
