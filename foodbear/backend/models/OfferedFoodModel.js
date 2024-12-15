const mongoose = require("mongoose");
const { Schema } = mongoose;

const OfferedFoodSchema = new Schema({
    foodId: {
        type: String,
        required: true,
    },
    restaurant_id: {
        type: String,
        required: true,
    },
    foodItemName: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    offeredCatagoryName: {
        type: String,
        required: true,
    },
    mainPrice: {
        type: Number,
        required: true,
    },
    offeredPrice: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    is_instock: {
        type: Boolean,
        default: true,
    },
}); 

module.exports = mongoose.model("offeredFood", OfferedFoodSchema);
