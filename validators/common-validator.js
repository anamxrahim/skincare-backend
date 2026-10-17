import { z } from "zod";

// Text Field Validation
export const text = (label) =>
    z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? `${label} is required`
                    : `${label} must be text`,
        })
        .trim()
        .min(1, `${label} is required`);


// Number Field Validation
export const number = (label) =>
    z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? `${label} is required`
                    : `${label} must be a number`,
        })
        .min(0, "Price cannot be negative");

        
// MongoDB ObjectId Validation
export const objectId = z
    .string({
        error: "ID is required",
    })
    .trim()
    .toLowerCase()
    .regex(/^[0-9a-f]{24}$/, "Invalid ID");


// Route Parameter Validation Schema
export const idParamSchema = z.object({
    id: objectId,
});