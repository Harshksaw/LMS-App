const Coupon = require("../models/coupons");
const moment = require("moment");
const Logs = require("../models/Logs");

exports.checkCoupon = async (req, res) => {
  const { coupon, course } = req.body;

  try {
    if (!coupon) {
      return res.status(500).json({ message: "coupon code required" });
    }
    const couponData = await Coupon.findOne({ code: coupon });

    if (!couponData) {
      return res.status(404).json({ message: "Invalid coupon*" });
    }
    const expired = moment(couponData?.expiryDate).isBefore(new Date());
    if (expired) {
      return res.status(404).json({ message: "coupon expired*" });
    }

    if (!!couponData.courses.length && !couponData.courses.includes(course)) {
      return res
        .status(404)
        .json({ message: "coupon invalid for this course bundle*" });
    }
    res.status(200).json({ message: "coupon Applied", data: couponData });
  } catch (error) {
    throw error;
  }
};
exports.createCoupon = async (req, res) => {
  const { code, discountPercentage, expiryDate, courses } = req.body;

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
    const couponData = await Coupon.create({
      ...req.body,
      code: code.toUpperCase(),
    });
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
  const { code, discountPercentage, expiryDate, courses } = req.body;
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
  if (!!courses?.length) {
    update.courses = courses;
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

exports.logsCoupon = async (req, res) => {
  try {
    const data = await Logs.create(req.body);
    if (req.body.logType == 1) {
      const coupon = await Coupon.findOne({ code: req.body.title });

      if (coupon && coupon?.used !== null) {
        coupon.used = coupon.used + 1;
        coupon.save();
      }
    }
    if (!data) {
      return res.status(404).json({ message: "something went wrong*" });
    }
    res.status(200).json({
      message: "log created!",
      data: data,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.getLogs = async (req, res) => {
  try {
    // const data = await Logs.find(req.body).populate(["userId", "courseId"]);
    const data = await Logs.find(req.body)
      .populate("userId", ["_id", "name"])
      .populate("courseId", ["_id", "bundleName"]);
    if (!data) {
      return res.status(404).json({ message: "logs not found*" });
    }
    res.status(200).json({ message: "logs fetched", data });
  } catch (error) {
    throw error;
  }
};
