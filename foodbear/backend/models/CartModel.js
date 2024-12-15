const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({


    user_id: {
        type: String,
        required: true
    }, 

    food_id: {
        type: String,
        required: true
    },

    restaurant_id: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("cart", CartSchema);