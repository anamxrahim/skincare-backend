import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { productRoutes } from "./Routes/product-routes.js";
import { orderRoutes } from "./Routes/order-routes.js";

const app = express();

app.use(express.json());
app.use(cors());

// API Routes

app.use("/web/api", productRoutes);
app.use("/web/api", orderRoutes);

// Handle JSON Parsing and Other Server Errors

app.use((err, req, res, next) => {

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            status: 0,
            msg: "Invalid JSON body",
        });
    }

    console.error(err);

    res.status(500).json({
        status: 0,
        msg: "Server Error",
    });
});

// Handle Routes That Do Not Exist

app.use((req, res) => {
    res.status(404).json({
        status: 0,
        msg: "Route Not Found",
    });
});

// Connect to MongoDB

mongoose
    .connect(process.env.dbUrl)
    .then(() => {
        console.log("Connected to MongoDB");

        // Start Server After Database Connection
        
        app.listen(process.env.PORT, () => {
            console.log(
                "Server running on port " + process.env.PORT
            );
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed", err.message);
    });


