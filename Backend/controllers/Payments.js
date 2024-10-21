const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const Order = require("../models/order");

// initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.status(400).json({ success: false, message: "Please provide Course Id" });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(404).json({ success: false, message: "Could not find the course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({ success: false, message: "Student is already Enrolled" });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    payment_capture: 1,  // Enable auto payment capture by Razorpay
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log("Order created with auto capture:", paymentResponse);

    res.json({
      success: true,
      message: "Payment created and will be auto captured",
      paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Could not Initiate Order" });
  }
};

// verify the payment
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(400).json({ success: false, message: "Payment Failed" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      console.log("Payment verified successfully.");
      await enrollStudents(courses, userId);
      return res.status(200).json({ success: true, message: "Payment Verified and Enrollment Successful" });
    } catch (error) {
      console.error('Error enrolling students:', error);
      return res.status(500).json({ success: false, message: "Enrollment Failed" });
    }
  }
  return res.status(400).json({ success: false, message: "Payment Verification Failed" });
};

const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please Provide data for Courses or UserId");
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        throw new Error("Course not Found");
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      await mailSender(
        enrolledCourse.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledCourse.firstName}`
        )
      );
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res.status(500).json({ success: false, message: "Could not send email" });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { user, items, totalAmount, details } = req.body;

    const orderCreated = new Order({
      user,
      items,
      totalAmount,
      details,
    });

    await orderCreated.save();

    res.status(201).json({
      success: true,
      data: orderCreated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.find()
      .populate("user")
      .populate("items.item")
      .sort({ orderDate: -1 });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ user: id })
      .populate("items.item")
      .sort({ orderDate: -1 });

    if (!orders) {
      return res.status(404).json({ error: "Orders not found" });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
