const express = require('express');
const { uploadOrders, getAllOrders, deleteOrder } = require('../Controller/OrderController.js');
const OrderRouter = express.Router();

OrderRouter.post("/upload-orders",uploadOrders)
OrderRouter.get("/get-all-orders",getAllOrders)
OrderRouter.delete("/delete-upload-order/:id",deleteOrder)
module.exports = OrderRouter