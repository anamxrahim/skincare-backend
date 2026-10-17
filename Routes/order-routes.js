import express from "express";

import {
    insertOrder,
    orderList,
    getSingleOrder,
    updateOrderStatus,
} from "../controllers/order-controller.js";

import validate from "../middlewares/validate.js";

import { idParamSchema } from "../validators/common-validator.js";

import {
    createOrderSchema,
    updateOrderStatusSchema,
} from "../validators/order-validator.js";

const orderRoutes = express.Router();

// Place a New Order

orderRoutes.post(
    "/insert-order",
    validate(createOrderSchema),
    insertOrder
);

// Get All Orders

orderRoutes.get(
    "/order-list",
    orderList
);

// Get Single Order by ID

orderRoutes.get(
    "/get-order/:id",
    validate(idParamSchema, "params"),
    getSingleOrder
);

// Update Order Status

orderRoutes.put(
    "/order-status/:id",
    validate(idParamSchema, "params"),
    validate(updateOrderStatusSchema),
    updateOrderStatus
);

export { orderRoutes };