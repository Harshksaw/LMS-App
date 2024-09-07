// Import the required modules
const express = require("express");
const router = express.Router();
const coupon = require("../controllers/coupon");

// /api/v1/coupon=>
// coupons routes
router.get("/", coupon.getCoupons);
router.post("/", coupon.createCoupon);
router.delete("/:id", coupon.deleteCoupon);
router.put("/:id", coupon.editCoupon);
router.post("/apply-coupon", coupon.checkCoupon);

module.exports = router;
