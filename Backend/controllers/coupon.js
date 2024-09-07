const Coupon = require("../models/coupons");
const moment = require("moment");

exports.checkCoupon = async (req, res) => {
  const { coupon } = req.body;

  try {
    if (!coupon) {
      return res.status(500).json({ message: "coupon code required" });
    }
    const couponData = await Coupon.findOne({ code: coupon });
    const expired = moment(couponData.expiryDate).isBefore(new Date());
    if (expired) {
      return res.status(404).json({ message: "Invalid coupon*" });
    }

    if (!couponData) {
      return res.status(404).json({ message: "Invalid coupon*" });
    }
    res.status(200).json({ message: "coupon Applied", data: couponData });
  } catch (error) {
    throw error;
  }
};
exports.createCoupon = async (req, res) => {
  const { code, discountPercentage, expiryDate } = req.body;

  try {
    if (!code) {
      return res.status(500).json({ message: "coupon code required" });
    }
    if (!discountPercentage) {
      return res.status(500).json({ message: "discountPercentage required" });
    }
    if (!expiryDate) {
      return res.status(500).json({ message: "expiryDate required" });
    }
    const couponData = await Coupon.create(req.body);
    if (!couponData) {
      return res.status(404).json({ message: "coupon not created*" });
    }
    res.status(200).json({
      message: "coupon added successfull",
      data: couponData,
      status: true,
    });
  } catch (error) {
    throw error;
  }
};
exports.editCoupon = async (req, res) => {
  const { code, discountPercentage, expiryDate } = req.body;
  const update = {};
  if (code) {
    update.code = code;
  }
  if (discountPercentage) {
    update.discountPercentage = discountPercentage;
  }
  if (expiryDate) {
    update.expiryDate = expiryDate;
  }
  try {
    const couponData = await Coupon.findOneAndUpdate(
      { _id: req.params.id },
      update
    );
    if (!couponData) {
      return res.status(404).json({ message: "coupon not created*" });
    }
    res.status(200).json({
      message: "coupon added successfull",
      data: couponData,
      status: true,
    });
  } catch (error) {
    throw error;
  }
};
exports.getCoupons = async (req, res) => {
  try {
    const couponData = await Coupon.find();
    if (!couponData) {
      return res.status(404).json({ message: "coupon not found*" });
    }
    res.status(200).json({ message: "coupon fetched", data: couponData });
  } catch (error) {
    throw error;
  }
};
exports.deleteCoupon = async (req, res) => {
  try {
    const couponData = await Coupon.deleteOne({ _id: req.params.id });
    if (!couponData) {
      return res.status(404).json({ message: "coupon not found*" });
    }
    res.status(200).json({
      message: "coupon removed success",
      data: couponData,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};
