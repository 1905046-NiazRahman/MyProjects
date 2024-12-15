const mongoose = require("mongoose");
const { Schema } = mongoose;

const OfferFoodCategorySchema = new Schema({
    CategoryName: {
        type: String,
        required: true,
    },
}, { collection: "offerFoodCategory" });

module.exports = mongoose.model("OfferFoodCategory", OfferFoodCategorySchema);
