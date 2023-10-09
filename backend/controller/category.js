const { Category, Product } = require("../models");

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await Category.create({
      name,
    });

    // await Product.create({
    //   categoryId: result.id,
    // });

    res.status(201).json({
      ok: true,
      message: "Category created!",
      detail: result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: String(error),
    });
  }
};

exports.editCategory = async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  try {
    const category = await Category.findOne({ where: { name } });

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Category not found",
      });
    }

    category.name = newName;
    await category.save();

    res.status(200).json({
      ok: true,
      message: "Category updated successfully",
      detail: category,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: String(error),
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { name } = req.params;

  try {
    const category = await Category.findOne({ where: { name } });

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Category not found",
      });
    }

    await category.destroy();

    res.status(200).json({
      ok: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      meessage: String(error),
    });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.findAll();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No categories found!",
      });
    }

    const categoryName = categories.map((category) => category.name);

    res.status(200).json({
      ok: true,
      message: "Categories retrieved successfully",
      categories: categoryName,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieved categories",
      detail: String(error),
    });
  }
};
