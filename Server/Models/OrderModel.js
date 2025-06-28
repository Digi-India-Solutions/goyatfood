const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderUniqueId: {
    type: String,
    trim: true,
    default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  },
  name: {
    type: String,
    trim: true,
  },
  items: [
    {
      productName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        trim: true,
        required: true,
      },
      grams: {
        type: String,
        trim: true,
      },
      quantity: {
        type: Number,
        trim: true,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  upiId: {
    type: String,
    trim: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
