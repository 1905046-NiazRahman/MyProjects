const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderReviewSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
});

const OrderReview = mongoose.model("OrderReview", OrderReviewSchema);

module.exports = OrderReview;
