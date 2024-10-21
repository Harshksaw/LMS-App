const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const os = require("os"); // Added missing os import
const Order = require("../models/order");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");

// Webhook endpoint for Razorpay
router.post("/webhook/razorpay", async (req, res) => {
  // Since secret is not being used, skip signature validation

  const event = req.body.event;

  if (event === "order.paid") {
    const { order_id } = req.body.payload.payment.entity;

    try {
      const order = await Order.findOne({ orderId: order_id });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      console.log("Order found:", order);

      // Enroll the user in the courses
      await enrollStudents(order.items, order.user);

      return res.status(200).json({ success: true, message: "Payment Verified and Enrollment Successful" });
    } catch (error) {
      console.error("Error enrolling students:", error);
      return res.status(500).json({ success: false, message: "Enrollment Failed" });
    }
  }

  res.status(200).json({ success: true });
});

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
        courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledCourse.firstName}`)
      );
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

// Export the router for your server to use
module.exports = router;

// index.js file update

const express = require("express");
const app = express();
const os = require("os"); // Added missing os import

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const quizRoutes = require("./routes/Quiz");
const studymaterials = require("./routes/studymaterial");
const APPRoute = require("./routes/app");
const CourseBundle = require("./routes/courseBundle");
const Dailyupdate = require("./routes/Dailyupdate");
const coupon = require("./routes/coupon");
const videocourse = require("./routes/video");
const razorpayWebhook = require("./routes/razorpayWebhook");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const { exec } = require("child_process");
const videoStreamController = require("./controllers/video-stream");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Create WebSocket server
const wss = new WebSocket.Server({ port: 4001 });
let requestCount = 0;

// Middleware to count requests
app.use((req, res, next) => {
  requestCount++; // Increment the request count
  next();
});

// Function to get disk usage
const getDiskUsage = (path) => {
  return new Promise((resolve) => {
    exec(
      `df -h ${path} | tail -1 | awk '{print $2, $3, $4}'`,
      (error, stdout) => {
        if (error) {
          resolve({ total: "0", used: "0", free: "0" });
        } else {
          const [total, used, free] = stdout.trim().split(" ");
          resolve({ total, used, free });
        }
      }
    );
  });
};

// Function to get system info
const getSystemInfo = async () => {
  const cpuUsage = await new Promise((resolve) => {
    exec(
      "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\([0-9.]*\)%* id.*/\1/' | awk '{print 100 - $1}'",
      (error, stdout) => {
        if (error) {
          resolve("0");
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });

  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  const diskInfo = await getDiskUsage("/");

  const networkInterfaces = os.networkInterfaces();
  const networkInterfaceCount = Object.keys(networkInterfaces).length;

  return {
    cpuUsage,
    memoryUsage: ((usedMemory / totalMemory) * 100).toFixed(2),
    totalMemory: (totalMemory / (1024 * 1024 * 1024)).toFixed(2), // in GB
    freeMemory: (freeMemory / (1024 * 1024 * 1024)).toFixed(2), // in GB
    usedMemory: (usedMemory / (1024 * 1024 * 1024)).toFixed(2), // in GB
    diskInfo,
    networkInterfaceCount,
    requestCount,
  };
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  const sendSystemInfo = async () => {
    if (ws.readyState === WebSocket.OPEN) {
      const systemInfo = await getSystemInfo();
      ws.send(JSON.stringify(systemInfo));
    }
  };

  const interval = setInterval(sendSystemInfo, 1000);

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  ws.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

//database connect
database.connect();
//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// cloudinaryConnect();
app.use("/api/v1/app", APPRoute);

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/coupon", coupon);

app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/study", studymaterials);
app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/bundle", CourseBundle);
app.use("/api/v1/DailyUpdate", Dailyupdate);

app.use("/api/v1/videocourse", videocourse);
app.use("/api/webhook/razorpay", razorpayWebhook); // Add webhook route

// Video stream upload
app.post("/api/v1/video", (req, res) => {
  const clientId = req.query.clientId; // Assume clientId is passed as a query parameter
  videoStreamController.uploadVideo(req, res, clientId);
});

app.get("/api/v1/checkStatus/:lessonId", (req, res) => {
  videoStreamController.checkStatus(req, res);
});

// Backup function
const { spawn } = require("child_process");

async function runBackup() {
  const sourceUri = process.env.MONGODB_URL;
  const targetUri = process.env.MONGO_URI_BACKUP;

  if (!sourceUri || !targetUri) {
    console.error("Missing sourceUri or
