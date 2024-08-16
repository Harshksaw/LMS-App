const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const quizRoutes = require("./routes/Quiz");
const studymaterials = require("./routes/studymaterial");

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

// cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/study", studymaterials);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.use("/api/v1/Bundle", CourseBundle)
app.use("/api/v1/DailyUpdate",Dailyupdate)


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
