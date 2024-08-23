const express = require("express");
const app = express();
const { exec } = require('child_process');

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const quizRoutes = require("./routes/Quiz");
const studymaterials = require("./routes/studymaterial");
const APPRoute = require('./routes/app')
const CourseBundle = require("./routes/courseBundle")
const Dailyupdate = require("./routes/Dailyupdate")

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");

const dotenv = require("dotenv");




dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
// 	cors({
// 		origin:"http://localhost:3000",
// 		credentials:true,
// 	})
// )
app.use(cors({}));
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// cloudinaryConnect();
app.use("/api/v1/app", APPRoute);

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/study", studymaterials);
app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/bundle", CourseBundle)
app.use("/api/v1/DailyUpdate",Dailyupdate)


app.post('/backup', (req, res) => {
  // const { sourceUri, targetUri } = req.body;
  const sourceUri = process.env.MONGODB_URL;
  const targetUri = process.env.MONGO_URI_BACKUP;

  if(!sourceUri || !targetUri) {
    return res.status(400).send('Missing sourceUri or targetUri');
  }

  // Step 1: Create a backup
  exec(`mongodump --uri="${sourceUri}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error creating backup: ${stderr}`);
      return res.status(500).send('Error creating backup');
    }

    // Step 2: Restore the backup
    exec(`mongorestore --uri="${targetUri}" dump/`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error restoring backup: ${stderr}`);
        return res.status(500).send('Error restoring backup');
      }

      res.send('Backup and restore completed successfully');
    });
  });
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
