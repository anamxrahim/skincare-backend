import { z } from "zod";
import { text, number, objectId } from "./common-validator.js";

// Allowed Order Statuses
const STATUSES = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
];

// Customer Details Validation
const customerSchema = z.object(
    {
        // Customer Name
        name: text("Name").min(
            3,
            "Name must be at least 3 characters"
        ),

        // Customer Phone Number
        phone: text("Phone").regex(
            /^(\+92|92|0)?3\d{9}$/,
            "Enter a valid mobile number, e.g. 03001234567"
        ),

        // Customer Email
        email: z
            .union([
                z.email({
                    error: "Invalid email address",
                }),
                z.literal(""),
            ])
            .optional(),

        // Customer Address
        address: text("Address").min(
            10,
            "Please enter a complete address"
        ),

        // Customer City
        city: text("City").min(
            2,
            "City must be at least 2 characters"
        ),
    },
    {
        error: "Customer details are required",
    }
);

// Order Item Validation
const itemSchema = z.object({
    // Product ID
    product: objectId,

    // Product Quantity
    quantity: number("Quantity")
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1"),
});

// Create Order Validation
export const createOrderSchema = z.object({
    // Customer Details
    customer: customerSchema,

    // Order Items
    items: z
        .array(itemSchema, {
            error: "Items are required",
        })
        .min(1, "Cart is empty")
        .refine(
            (items) =>
                new Set(
                    items.map((item) => item.product)
                ).size === items.length,
            "Same product added twice, increase its quantity instead"
        ),
});

// Update Order Status Validation
export const updateOrderStatusSchema = z.object({
    status: z.enum(STATUSES, {
        error: `Status must be one of: ${STATUSES.join(", ")}`,
    }),
});