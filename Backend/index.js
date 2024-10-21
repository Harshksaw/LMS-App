const express = require("express");
const app = express();
const os = require("os");

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
const { exec, spawn } = require("child_process");
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

  const interval = setInterval(sendSystemInfo, 10000);

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

// Connect to database
database.connect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Application routes
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
app.use("/api/webhook", razorpayWebhook); // Updated webhook route

// Video stream upload
app.post("/api/v1/video", (req, res) => {
  const clientId = req.query.clientId; // Assume clientId is passed as a query parameter
  videoStreamController.uploadVideo(req, res, clientId);
});

// Backup function
async function runBackup() {
  const sourceUri = process.env.MONGODB_URL;
  const targetUri = process.env.MONGO_URI_BACKUP;

  if (!sourceUri || !targetUri) {
    console.error("Missing sourceUri or targetUri");
    return;
  }

  // Step 1: Create a backup
  const dumpProcess = spawn("mongodump", [
    "--uri",
    sourceUri,
    "--archive=dump.gz",
    "--gzip",
  ]);
  dumpProcess.stderr.on("data", (data) => {
    console.error(`Error creating backup: ${data}`);
  });

  await new Promise((resolve, reject) => {
    dumpProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Error creating backup: Exit code ${code}`));
      } else {
        resolve();
      }
    });
  });

  // Step 2: Restore the backup
  const restoreProcess = spawn("mongorestore", [
    "--uri",
    targetUri,
    "--archive=dump.gz",
    "--gzip",
  ]);
  restoreProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  restoreProcess.stderr.on("data", (data) => {
    console.error(`Error restoring backup: ${data}`);
  });

  await new Promise((resolve, reject) => {
    restoreProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Error restoring backup: Exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

// Backup endpoint
app.get("/backup", async (req, res) => {
  await runBackup();
  res.send("Backup process initiated");
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running at http://127.0.0.1:${PORT}`);
});
