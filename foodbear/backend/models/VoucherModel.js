const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserUsageSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    usage: {
        type: Number,
        default: 0,
    },
    max_usage: {
        type: Number,
        required: true,
    },
}, { _id: false }); // Prevent creation of an automatic _id for subdocuments

const VoucherSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    minimumAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    maxUsage: {
        type: Number,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true,
    },
    users: [UserUsageSchema], // Array of UserUsageSchema
});

module.exports = mongoose.model("vouchers", VoucherSchema);