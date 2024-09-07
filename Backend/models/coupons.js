const { Schema, default: mongoose } = require("mongoose");

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
