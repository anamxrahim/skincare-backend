import orderModel from "../models/order-model.js";
import productModel from "../models/product-model.js";

// Insert New Order

const insertOrder = async (req, res) => {
    try {
        // Get Validated Customer and Items

        const { customer, items } = req.validated.body;

        // Store Order Items and Calculate Total Price

        const orderItems = [];
        let totalPrice = 0;

        // Check Each Product in the Order

        for (const item of items) {
            const product = await productModel.findById(
                item.product
            );

            // Check Whether Product Exists

            if (!product) {
                return res.status(404).json({
                    status: 0,
                    msg: "Product not found",
                });
            }

            // Check Available Stock

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    status: 0,
                    msg: `${product.name} has insufficient stock`,
                });
            }

            // Add Product Details to Order Items

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });

            // Calculate Total Price

            totalPrice += product.price * item.quantity;
        }

        // Save Order in Database

        const order = await orderModel.create({
            customer,
            items: orderItems,
            totalPrice,
        });

        // Reduce Product Stock After Order Placement

        for (const item of orderItems) {
            await productModel.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                }
            );
        }

        // Send Successful Order Response

        res.status(201).json({
            status: 1,
            msg: "Order Placed Successfully",
            data: order,
        });
    } catch (err) {
        // Handle Unexpected Errors

        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

// Get All Orders

const orderList = async (req, res) => {
    try {
        // Fetch Orders from Newest to Oldest

        const data = await orderModel
            .find()
            .sort({ createdAt: -1 });

        // Send Orders Response

        res.status(200).json({
            status: 1,
            msg: "Orders",
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

// Get Single Order by ID

const getSingleOrder = async (req, res) => {
    try {
        // Find Order Using Its ID

        const order = await orderModel.findById(
            req.validated.params.id
        );

        // Check Whether Order Exists

        if (!order) {
            return res.status(404).json({
                status: 0,
                msg: "Order Not Found",
            });
        }

        // Send Order Details

        res.status(200).json({
            status: 1,
            msg: "Order",
            data: order,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            status: 0,
            msg: "Server Error",
        });
    }
};

// Update Order Status

const updateOrderStatus = async (req, res) => {
    try {
        // Find Order and Update Its Status

        const order = await orderModel.findByIdAndUpdate(
            req.validated.params.id,
            {
                status: req.validated.body.status,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        // Check Whether Order Exists

        if (!order) {
            return res.status(404).json({
                status: 0,
                msg: "Order Not Found",
            });
        }

        // Send Updated Order Response
        
        res.status(200).json({
            status: 1,
            msg: "Order Status Updated",
            data: order,
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
    insertOrder,
    orderList,
    getSingleOrder,
    updateOrderStatus,
};