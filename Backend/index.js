const express = require("express");
const app = express();

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
const osUtils = require('os-utils');
const diskusage = require('diskusage');


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const dotenv = require("dotenv");
const videoStreamController = require('./controllers/video-stream');
const http = require('http');
const videocourse = require('./routes/video');
const os = require('os');
const { exec } = require('child_process');
const clients = new Map();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });





wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const clientId = urlParams.get('clientId');
  if (clientId) {
    clients.set(clientId, ws);

    ws.on('close', () => {
      clients.delete(clientId);
    });
  }
});

dotenv.config();
const PORT = process.env.PORT || 4000;

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


app.use('/api/v1/videocourse',videocourse )
app.post("/api/v1/video", (req, res) => {
  const clientId = req.query.clientId; // Assume clientId is passed as a query parameter
  videoStreamController.uploadVideo(req, res, clientId);
});
app.get("/api/v1/checkStatus/:lessonId", (req, res) => {
  videoStreamController.checkStatus(req, res);
});
const getDiskUsage = (path) => {
  return new Promise((resolve, reject) => {
    exec(`df -k ${path}`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      const lines = stdout.trim().split('\n');
      const diskInfo = lines[1].split(/\s+/);
      resolve({
        total: parseInt(diskInfo[1], 10) * 1024,
        used: parseInt(diskInfo[2], 10) * 1024,
        free: parseInt(diskInfo[3], 10) * 1024,
      });
    });
  });
};
const getSystemInfo = async () => {
  const cpuUsage = await new Promise((resolve) => {
    osUtils.cpuUsage((v) => {
      resolve(v);
    });
  });

  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = usedMemory / totalMemory;

  const diskInfo = await getDiskUsage('/'); // Root path for disk usage

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const networkInterfaces = os.networkInterfaces();
  const networkInterfaceCount = Object.keys(networkInterfaces).length;

  return {
    cpuUsage: (cpuUsage * 100).toFixed(2) + '%',
    memoryUsage: (memoryUsage * 100).toFixed(2) + '%',
    totalMemory: formatBytes(totalMemory),
    freeMemory: formatBytes(freeMemory),
    usedMemory: formatBytes(usedMemory),
    diskInfo: {
      total: formatBytes(diskInfo.total),
      used: formatBytes(diskInfo.used),
      free: formatBytes(diskInfo.free),
    },
    networkInterfaceCount: networkInterfaceCount,
  };
};

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendSystemInfo = async () => {
    if (ws.readyState === WebSocket.OPEN) {
      const systemInfo = await getSystemInfo();
      ws.send(JSON.stringify(systemInfo));
    }
  };

  const interval = setInterval(sendSystemInfo, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});


// Backup function
const { spawn } = require("child_process");

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
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at http://127.0.0.1:${PORT}`);
});
