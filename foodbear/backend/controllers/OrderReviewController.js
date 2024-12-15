const OrderReviewModel = require("../models/OrderReviewModel");

const createOrderReview = async (req, res) => {
  try {
    const newOrderReview = await OrderReviewModel.create(req.body);
    res.json({
      message: "New order review created!",
      orderReview: newOrderReview,
    });
  } catch (error) {
    console.error("Error creating order review:", error);
    res.json({ message: "Order review not created!" });
  }
};

const getOrderReview = async (req, res) => {
  const { userId, restaurantId, orderId } = req.params;
  try {
    const orderReview = await OrderReviewModel.findOne({
      userId,
      restaurantId,
      orderId,
    });
    if (!orderReview) {
      return res.json({ found: false });
    }
    res.json({ found: true });
  } catch (error) {
    console.error("Error fetching order review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrderReview,
  getOrderReview,
};
