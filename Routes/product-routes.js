import express from "express";

import {
    insertProduct,
    productList,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product-controller.js";

import validate from "../middlewares/validate.js";

import { idParamSchema } from "../validators/common-validator.js";

import {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
} from "../validators/product-validator.js";

// Create Product Router

const productRoutes = express.Router();

// Insert New Product

productRoutes.post(
    "/insert-product",
    validate(createProductSchema),
    insertProduct
);

// Get Product List with Query Filters

productRoutes.get(
    "/product-list",
    validate(productQuerySchema, "query"),
    productList
);

// Get Single Product by ID

productRoutes.get(
    "/product-list/:id",
    validate(idParamSchema, "params"),
    getSingleProduct
);

// Update Product by ID

productRoutes.put(
    "/product-update/:id",
    validate(idParamSchema, "params"),
    validate(updateProductSchema),
    updateProduct
);

// Delete Product by ID

productRoutes.delete(
    "/product-delete/:id",
    validate(idParamSchema, "params"),
    deleteProduct
);

export { productRoutes };