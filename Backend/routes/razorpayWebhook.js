// const express = require("express");
// const router = express.Router();
// const crypto = require("crypto");
// const Order = require("../models/order");
// const Course = require("../models/Course");
// const User = require("../models/User");
// const CourseProgress = require("../models/CourseProgress");
// const mailSender = require("../utils/mailSender");
// const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");

// // Webhook endpoint for Razorpay
// router.post("/razorpay", async (req, res) => {
//   try {
//     console.log("Webhook received:", req.body);

//     // Since the secret is not being used, we skip signature validation here.
//     const event = req.body.event;

//     if (event === "order.paid") {
//       const { order_id } = req.body.payload.payment.entity;

//       try {
//         const order = await Order.findOne({ orderId: order_id });

//         if (!order) {
//           return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         console.log("Order found:", order);

//         // Enroll the user in the courses
//         await enrollStudents(order.items, order.user);

//         return res.status(200).json({ success: true, message: "Payment Verified and Enrollment Successful" });
//       } catch (error) {
//         console.error("Error enrolling students:", error);
//         return res.status(500).json({ success: false, message: "Enrollment Failed" });
//       }
//     }

//     res.status(400).json({ success: false, message: "Unhandled event type" });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     return res.status(500).json({ success: false, message: "Webhook processing failed" });
//   }
// });

// const enrollStudents = async (courses, userId) => {
//   if (!courses || !userId) {
//     throw new Error("Please Provide data for Courses or UserId");
//   }

//   for (const courseId of courses) {
//     try {
//       const enrolledCourse = await Course.findOneAndUpdate(
//         { _id: courseId },
//         { $push: { studentsEnrolled: userId } },
//         { new: true }
//       );

//       if (!enrolledCourse) {
//         throw new Error("Course not Found");
//       }

//       const courseProgress = await CourseProgress.create({
//         courseID: courseId,
//         userId: userId,
//         completedVideos: [],
//       });

//       await User.findByIdAndUpdate(
//         userId,
//         {
//           $push: {
//             courses: courseId,
//             courseProgress: courseProgress._id,
//           },
//         },
//         { new: true }
//       );

//       // Send an email to the user about the enrollment
//       await mailSender(
//         enrolledCourse.email,
//         `Successfully Enrolled into ${enrolledCourse.courseName}`,
//         courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledCourse.firstName}`)
//       );
//     } catch (error) {
//       console.error(error);
//       throw new Error(error.message);
//     }
//   }
// };

// // Export the router for your server to use
// module.exports = router;
