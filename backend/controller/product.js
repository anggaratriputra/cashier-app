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

    if (productName) {
      product.name = productName;
    }
    if (price) {
      product.price = price;
    }
    if (category) {
      product.category = category;
    }
    if (description) {
      product.description = description;
    }
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
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const offset = (page - 1) * limit;
    // Find tickets associated with the user's account
    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      order: [["updatedAt", "DESC"]],
    });

  if (!products || products.length === 0) {
    return res.status(404).json({
      ok: false,
      message: "No products found!",
    });
  }

  res.status(200).json({
    ok: true,
    pagination: {
      totalData: count,
      page
    },
    details: products,
  });
};

exports.getSingleProduct = async (req, res) => {
  const { name } = req.params;
  const product = await Product.findOne({ where: { name } });

  if (!product) {
    res.status(404).json({
      ok: false,
      message: "Product Not Found!",
    });
  }

  res.status(200).json({
    ok: true,
    detail: product,
  });
};
