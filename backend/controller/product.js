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
  const sort = req.query.sort; // Get the sorting parameter from the query

  try {
    // Fetch all products without pagination
    const allProducts = await Product.findAll();

    // Check if a sorting option is provided and sort the products accordingly
    if (sort) {
      if (sort === 'alphabetical-asc') {
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'alphabetical-desc') {
        allProducts.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sort === 'price-asc') {
        allProducts.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        allProducts.sort((a, b) => b.price - a.price);
      }
    }

    // Calculate the total number of pages based on the sorted data count
    const totalData = allProducts.length;

    // Apply pagination to the sorted products
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);

    if (!products || products.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No products found!",
      });
    }

    res.status(200).json({
      ok: true,
      pagination: {
        totalData: totalData,
        page: page,
      },
      details: products,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
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
