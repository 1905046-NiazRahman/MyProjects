const OrderModel = require("../models/OrderModel"); // Replace with the actual path to your Order model

const getSpecificOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    // Find all orders for the specified orderId
    const order = await OrderModel.findById(orderId);
    res.send(order);
  } catch (error) {
    console.log("error in getting order");
    res.json({ message: "order not found!" });
  }
};

const acceptPreordered = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const preorderedOrder = await OrderModel.findByIdAndUpdate(orderId, {
      status: "preordered",
      // No delivery person is assigned for preordered orders
    });

    if (!preorderedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Preordered order confirmed" });
  } catch (error) {
    console.error("Error confirming preordered order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSpecificOrder,
  acceptPreordered,
};
