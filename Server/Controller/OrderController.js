const Order = require("../Models/OrderModel");

function generateProductDetails(input) {
  const products = [
    { name: "Raw Almonds", pricePerKg: 650 },
    { name: "Roasted Cashews", pricePerKg: 800 },
    { name: "Salted Pistachios", pricePerKg: 900 },
    { name: "Walnuts", pricePerKg: 700 },
    { name: "Hazelnuts", pricePerKg: 1000 },
    { name: "Macadamia", pricePerKg: 1800 },
    { name: "Brazil Nuts", pricePerKg: 1600 },
    { name: "Pecan Halves", pricePerKg: 1500 },
    { name: "Pine Nuts", pricePerKg: 2000 },
    { name: "Dry Peanuts", pricePerKg: 120 },
    { name: "Blanched Almonds", pricePerKg: 700 },
    { name: "Chili Cashews", pricePerKg: 850 },
    { name: "Smoked Almonds", pricePerKg: 750 },
    { name: "Caramelized Pecans", pricePerKg: 1600 },
    { name: "Honey Roasted Peanuts", pricePerKg: 300 },
    { name: "Mixed Nuts", pricePerKg: 900 },
    { name: "Organic Walnuts", pricePerKg: 850 },
    { name: "Trail Mix", pricePerKg: 600 },
    { name: "Butter Cashews", pricePerKg: 950 },
    { name: "Peanut Combo", pricePerKg: 200 },
  ];
  const cleaned = input.replace(/[₹Rs,\s]/g, "").trim();
  const totalPrice = Number(cleaned);
  if (isNaN(totalPrice)) {
    console.log("❌ totalPrice is not a number", totalPrice, input);
  }
  let productCount = 1;
  if (totalPrice > 2000) productCount = 4 + (totalPrice % 2);
  else if (totalPrice > 1000) productCount = 3;
  else if (totalPrice > 300) productCount = 2;

  // Deterministic pseudo-random number generator
  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const output = [];
  let remaining = Number(totalPrice);

  for (let i = 0; i < productCount; i++) {
    const seed = totalPrice * (i + 1);
    const productIndex = Math.min(
      products.length - 1,
      Math.floor(seededRandom(seed) * products.length)
    );

    const product = products[productIndex];
    if (!product) {
      console.error("❌ product is undefined at index", productIndex);
      continue;
    }

    const grams = (Math.floor(seededRandom(seed + 1) * 5) + 1) * 100; // 100–500g
    const quantity = Math.floor(seededRandom(seed + 2) * 2) + 1; // 1–2
    let pricePerUnit = (product.pricePerKg / 1000) * grams;
    let itemPrice = Math.round(pricePerUnit * quantity);

    if (i === productCount - 1 || itemPrice > remaining) {
      itemPrice = remaining;
    }

    output.push({
      productName: product.name,
      quantity,
      grams: `${grams} gm`,
      price: itemPrice,
    });

    remaining -= itemPrice;
    if (remaining <= 0) break;
  }

  return output;
}

const uploadOrders = async (req, res) => {
  try {
    const { orders } = req.body || {};
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const { Description, Amount } = orders[0];
    if (!Description || !Amount) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const InstertingOrders = orders.map((order) => {
      const productDetails = generateProductDetails(order.Amount);
      const cleaned = order.Amount.replace(/[₹Rs,\s]/g, "").trim();

      const totalAmount = Number(cleaned);
      const parts = order.Description.split("/");
      const name = parts[2];
      const upiId = parts[1];
      return {
        items: productDetails,
        totalAmount,
        name,
        upiId,
      };
    });

    const result = await Order.insertMany(InstertingOrders);
    return res.status(200).json({
      message: "Orders generated successfully",
      count: InstertingOrders.length,
      result,
    });
  } catch (error) {
    console.log("generateOrders", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const orders= await Order.find().skip((page - 1) * limit).limit(limit);
        const total = await Order.countDocuments();
        return res.status(200).json({data: orders, totalCount: total});
    } catch (error) {
       console.log("getAllOrders", error);
       return res.status(500).json({ message: "Get All Orders Internal Server Error" }); 
    }
}

const deleteOrder = async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
       return res.status(200).json({ message: "Order Deleted Successfully" }); 
    } catch (error) {
       console.log("deleteOrder", error);
        return res.status(500).json({ message: "Delete Order Internal Server Error" });
    }
}
module.exports = { uploadOrders,getAllOrders,deleteOrder };
