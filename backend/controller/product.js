const { Product, Category } = require("../models");

exports.createProduct = async (req, res) => {
  const { name, price, category, description } = req.body;
  const { filename } = req.file;

  if (!name || !price || !category || !description || !filename) {
    return res.status(400).json({
      ok: false,
      message: "Please provide all required information for the product.",
    });
  }

  try {
    let existingCategory = await Category.findOne({ where: { name: category } });

    if (!existingCategory) {
      existingCategory = await Category.create({
        name: category,
      });
    }

    const result = await Product.create({
      image: filename,
      name,
      price,
      category: existingCategory.name,
      description,
      isActive: 1,
    });

    res.status(200).json({
      ok: true,
      message: "Product created!",
      detail: result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "Product failed to build!",
      detail: String(error),
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { name } = req.params;
  const { productName, price, category, description } = req.body;

  try {
    const product = await Product.findOne({ where: { name } });

    if (!product) {
      res.status(404).json({
        ok: false,
        message: "Product Not Found!",
      });
    }

    product.name = productName;
    product.price = price;
    product.category = category;
    product.description = description;
    await product.save();

    res.status(200).json({
      ok: true,
      message: "Product updated successfully!",
      detail: product,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "Product failed to updated!",
      detail: String(error),
    });
  }
};

exports.deactivateProduct = async (req, res) => {
  const { name } = req.params;
  const { isActive } = req.body;

  try {
    const product = await Product.findOne({ where: { name } });

    if (!product) {
      res.status(404).json({
        ok: false,
        message: "Product Not Found!",
      });
    }

    product.isActive = isActive;
    await product.save();

    res.status(200).json({
      ok: true,
      message: "Success to change product status!",
      detail: {
        productName: product.name,
        isActive: product.isActive,
      },
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "Failed to Inactive product!",
      detail: String(error),
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll();

  if (!products) {
    return res.status(404).json({
      ok: false,
      message: "No products found!",
    });
  }

  res.status(200).json({
    ok: true,
    detail: products,
  });
};