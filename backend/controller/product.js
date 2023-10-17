const { Product, Category } = require("../models");
const { Op } = require("sequelize");

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
  const { id } = req.params;
  const { productName, price, category, description } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product Not Found!",
      });
    }

    if (req.file) {
      product.image = req.file.filename;
    } else {
      return res.status(404).json({
        ok: false,
        message: "Failed to upload image!",
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
    console.error(error);
    res.status(400).json({
      ok: false,
      message: "Product failed to updated!",
      detail: String(error),
    });
  }
};

exports.deactivateProduct = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const product = await Product.findByPk(id);

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
  const limit = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort; // Get the sorting parameter from the query
  const category = req.query.category; // Get the category filter from the query
  const search = req.query.search; // Get the search query from the query

  try {
    const filter = {
      where: {},
    };

    // Apply category filter
    if (category && category !== "All") {
      filter.where.category = category;
    }

    // Apply search query filter using Sequelize's Op.like
    if (search) {
      filter.where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // Include sorting options
    if (sort) {
      if (sort === "alphabetical-asc") {
        filter.order = [["name", "ASC"]];
      } else if (sort === "alphabetical-desc") {
        filter.order = [["name", "DESC"]];
      } else if (sort === "price-asc") {
        filter.order = [["price", "ASC"]];
      } else if (sort === "price-desc") {
        filter.order = [["price", "DESC"]];
      }
    }

    // Apply pagination
    filter.limit = limit;
    filter.offset = (page - 1) * limit;

    const products = await Product.findAndCountAll(filter);

    if (!products || products.count === 0) {
      return res.status(404).json({
        ok: false,
        message: "No products found!",
      });
    }

    res.status(200).json({
      ok: true,
      pagination: {
        totalData: products.count,
        page: page,
      },
      details: products.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.getAllActiveProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort; // Get the sorting parameter from the query
  const category = req.query.category; // Get the category filter from the query
  const search = req.query.search; // Get the search query from the query

  try {
    const filter = {
      where: { isActive: true },
    };

    // Apply category filter
    if (category && category !== "All") {
      filter.where.category = category;
    }

    // Apply search query filter using Sequelize's Op.like
    if (search) {
      filter.where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // Include sorting options
    if (sort) {
      if (sort === "alphabetical-asc") {
        filter.order = [["name", "ASC"]];
      } else if (sort === "alphabetical-desc") {
        filter.order = [["name", "DESC"]];
      } else if (sort === "price-asc") {
        filter.order = [["price", "ASC"]];
      } else if (sort === "price-desc") {
        filter.order = [["price", "DESC"]];
      }
    }

    // Apply pagination
    filter.limit = limit;
    filter.offset = (page - 1) * limit;

    const products = await Product.findAndCountAll(filter);

    if (!products || products.count === 0) {
      return res.status(404).json({
        ok: false,
        message: "No products found!",
      });
    }

    res.status(200).json({
      ok: true,
      pagination: {
        totalData: products.count,
        page: page,
      },
      details: products.rows,
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
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      ok: false,
      message: "Product Not Found!",
    });
  }

  res.status(200).json({
    ok: true,
    detail: product,
  });
};
