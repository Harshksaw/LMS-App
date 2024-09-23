
const Config = require("../models/App");
const mailSender = require("../utils/mailSender")
const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2;
dotenv.config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const {exec} = require( "child_process") // watch out

exports.uploadVideo = async (req, res) => {
    console.log("req.file", req.file)

    const lessonId = uuidv4()
  const videoPath = req.file.path
//   const outputPath = `/uploads/courses/${lessonId}`
console.log("videoPath", videoPath)
// Ensure the directory exists

const outputPath = path.join(__dirname, 'uploads', 'courses', lessonId);
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  const hlsPath = `${outputPath}/index.m3u8`
  console.log("hlsPath", hlsPath,"---")

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {recursive: true})
  }

  // ffmpeg
  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

  // no queue because of POC, not to be used in production
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`)
    }
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
    const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;

    res.json({
      message: "Video converted to HLS format",
      videoUrl: videoUrl,
      lessonId: lessonId
    })
  })


}






