import productModel from "../models/product-model.js";

// Escape Special Characters in Search Text

const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Insert Product

const insertProduct = async (req, res) => {
    try {
        const product = await productModel.create(
            req.validated.body
        );

        res.status(201).json({
            status: 1,
            msg: "Product Saved Successfully",
            data: product,
        });
    } catch (err) {
        // Handle Duplicate Slug Error

        if (err.code === 11000) {
            return res.status(409).json({
                status: 0,
                msg: "Slug already exists",
            });
        }

        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

// Get Product List with Filters

const productList = async (req, res) => {
    try {
        // Get Validated Query Parameters

        const {
            category,
            skinTypes,
            concerns,
            search,
            minPrice,
            maxPrice,
        } = req.validated.query;

        // Build Product Filter

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (skinTypes) {
            filter.skinTypes = skinTypes;
        }

        if (concerns) {
            filter.concerns = concerns;
        }

        // Search Products by Name

        if (search) {
            filter.name = {
                $regex: escapeRegex(search),
                $options: "i",
            };
        }

        // Filter Products by Price Range

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = minPrice;
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = maxPrice;
            }
        }

        // Fetch Products from Database

        const data = await productModel.find(filter);

        res.status(200).json({
            status: 1,
            msg: "Products",
            data,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

// Get Single Product by ID

const getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(
            req.validated.params.id
        );

        // Check Whether Product Exists

        if (!product) {
            return res.status(404).json({
                status: 0,
                msg: "Product Not Found",
            });
        }

        res.status(200).json({
            status: 1,
            msg: "Product",
            data: product,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

// Update Product

const updateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(
            req.validated.params.id,
            req.validated.body,
            {
                new: true,
                runValidators: true,
            }
        );

        // Check Whether Product Exists

        if (!product) {
            return res.status(404).json({
                status: 0,
                msg: "Product Not Found",
            });
        }

        res.status(200).json({
            status: 1,
            msg: "Product Updated Successfully",
            data: product,
        });
    } catch (err) {
        // Handle Duplicate Slug Error

        if (err.code === 11000) {
            return res.status(409).json({
                status: 0,
                msg: "Slug already exists",
            });
        }

        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

// Delete Product

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(
            req.validated.params.id
        );

        // Check Whether Product Exists

        if (!product) {
            return res.status(404).json({
                status: 0,
                msg: "Product Not Found",
            });
        }

        res.status(200).json({
            status: 1,
            msg: "Product Deleted Successfully",
            data: product,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

export {
    insertProduct,
    productList,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};