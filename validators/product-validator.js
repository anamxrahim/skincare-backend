import { z } from "zod";
import { text, number } from "./common-validator.js";

// Allowed Product Categories
const CATEGORIES = [
    "cleanser",
    "serum",
    "moisturizer",
    "sunscreen",
    "mask",
    "toner",
];

// Allowed Product Usage Times
const TIMES = ["AM", "PM", "AM/PM"];


// String Array Validation
const stringList = (label) =>
    z.array(
        z
            .string()
            .trim()
            .min(1, `${label} cannot have empty values`),
        {
            error: `${label} must be a list`,
        }
    );


// Optional Query Number Validation
const queryNumber = (label) =>
    z.preprocess(
        (value) =>
            value === "" ||
            value === null ||
            value === undefined
                ? undefined
                : value,
        z
            .coerce
            .number({
                error: `${label} must be a number`,
            })
            .min(0, `${label} cannot be negative`)
            .optional()
    );

    
// Product Body Validation
const productBody = z.object({
    // Product Name
    name: text("Name").min(
        3,
        "Name must be at least 3 characters"
    ),

    // Product Slug
    slug: text("Slug")
        .toLowerCase()
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can only have lowercase letters, numbers and hyphens"
        ),

    // Product Category
    category: z.enum(CATEGORIES, {
        error: `Category must be one of: ${CATEGORIES.join(", ")}`,
    }),

    // Product Concerns
    concerns: stringList("Concerns").optional(),

    // Suitable Skin Types
    skinTypes: stringList("Skin types").optional(),

    // Key Ingredients
    keyIngredients: stringList("Key ingredients").optional(),

    // Product Description
    description: text("Description").min(
        10,
        "Description must be at least 10 characters"
    ),

    // Product Usage Instructions
    howToUse: z
        .object({
            time: z
                .enum(TIMES, {
                    error: "Time must be AM, PM or AM/PM",
                })
                .optional(),

            step: z.string().trim().optional(),
        })
        .optional(),

    // Product Size
    size: z
        .string()
        .trim()
        .min(1, "Size is required")
        .optional(),

    // Product Price
    price: number("Price").min(
        0,
        "Price cannot be negative"
    ),

    // Product Images
    images: stringList("Images").optional(),

    // Available Stock
    stock: number("Stock")
        .int("Stock must be a whole number")
        .min(0, "Stock cannot be negative")
        .optional(),

    // Featured Product Status
    isFeatured: z
        .boolean({
            error: "isFeatured must be true or false",
        })
        .optional(),
});


// Create Product Validation
export const createProductSchema = productBody;


// Update Product Validation
export const updateProductSchema = productBody
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field is required to update"
    );


// Product Query Filter Validation
export const productQuerySchema = z
    .object({
        // Filter by Category
        category: z
            .enum(CATEGORIES, {
                error: `Category must be one of: ${CATEGORIES.join(", ")}`,
            })
            .optional(),

        // Filter by Skin Type
        skinTypes: z.string().trim().optional(),

        // Filter by Skin Concern
        concerns: z.string().trim().optional(),

        // Search Products
        search: z.string().trim().optional(),

        // Minimum Price Filter
        minPrice: queryNumber("minPrice"),

        // Maximum Price Filter
        maxPrice: queryNumber("maxPrice"),
    })

    // Validate Minimum and Maximum Price
    .refine(
        (query) =>
            query.minPrice === undefined ||
            query.maxPrice === undefined ||
            query.minPrice <= query.maxPrice,
        {
            error: "minPrice cannot be greater than maxPrice",
        }
    );