const { Category } = require("../models");

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await Category.create({
      name,
    });

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
