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

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");

const dotenv = require("dotenv");

// const sslOptions = {
//   key: fs.readFileSync(path.resolve(__dirname, 'path/to/your/private.key')),
//   cert: fs.readFileSync(path.resolve(__dirname, 'path/to/your/certificate.crt')),
//   ca: fs.readFileSync(path.resolve(__dirname, 'path/to/your/ca_bundle.crt')) // Optional, if you have a CA bundle
// };

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());
// app.use(
// 	cors({
// 		origin:"http://localhost:3000",
// 		credentials:true,
// 	})
// )
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

const cron = require("node-cron");
// Cron job
let task = cron.schedule("21 16 * * *", () => {
  console.log("Running backup cron job");
  runBackup();
});

// Backup function
const { spawn } = require("child_process");
const fs = require("fs");

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

// D:\CODES-wev-Devolopment\mp-7\server\index.js
