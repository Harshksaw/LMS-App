const multer = require('multer');
const { exec } = require('child_process');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Course = require('../models/Course');
const ffprobe = require('ffprobe-static'); // Install using `npm install ffprobe-static`
const { execSync } = require('child_process');
const mongoose = require('mongoose'); 


async function getVideoDuration(videoPath) {
  try {
    const command = `ffprobe -v quiet -print_format json -show_format -show_streams ${videoPath}`;
    const output = execSync(command);
    const ffprobeData = JSON.parse(output);
    const duration = parseFloat(ffprobeData.format.duration);
    return duration;
  } catch (error) {
    console.error(`Error extracting video duration: ${error.message}`);
    throw error;
  }
}
// Multer configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + uuidv4() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_KEY_H,
  secretAccessKey: process.env.AWS_SECRET_KEY_H,
  region: "ca-central-1",
});
const s3 = new AWS.S3();

exports.createVideo = async (req, res) => {
  const { courseName, courseDescription, status } = req.body;

  const thumbnail = req.file.path;
  const course = new Course({
    courseName,
    courseDescription,

    thumbnail,

    status,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
    clearUploadsFolder()
  } catch (err) {
    res.status(400).json({ message: err.message });
    clearUploadsFolder()
  }
};




const queue = [];

// Worker to process the queue
setInterval(() => {
  if (queue.length > 0) {
    const { videoPath, lessonId } = queue.shift();
    processVideo(videoPath, lessonId);
  }
}, 1000);

async function processVideo(videoPath, lessonId) {
  const outputPath = path.join(__dirname, 'uploads', 'courses', lessonId);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  const hlsPath = `${outputPath}/index.m3u8`;

  let videoDuration;
  try {
    videoDuration = await getVideoDuration(videoPath);
  } catch (error) {
    console.error(`Failed to get video duration: ${error.message}`);
    throw error;
  }

  const segmentDuration = videoDuration ? Math.min(10, Math.floor(videoDuration / 6)) : 10; // Default or calculated segment
  console.log("🚀 ~ processVideo ~ segmentDuration:", segmentDuration)
  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time ${segmentDuration} -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

  try {
    const ffmpegOutput = execSync(ffmpegCommand, { stdio: 'pipe' }).toString();
    console.log(`FFmpeg output: ${ffmpegOutput}`);
  } catch (error) {
    console.error(`FFmpeg command failed: ${error.message}`);
    throw error; // Re-throw error for handling in uploadVideo
  }

  // Upload index.m3u8 to S3 with proper ContentType
  const params = {
    Bucket: "krishanacademylms",
    Key: `courses/${lessonId}/index.m3u8`,
    Body: fs.readFileSync(hlsPath),
    ContentType: 'application/vnd.apple.mpegurl'
  };

  await s3.upload(params).promise();

  // Upload segment files to S3 in parallel using Promise.all
  const segmentFiles = fs.readdirSync(outputPath).filter(file => file.endsWith('.ts'));
  const uploadPromises = segmentFiles.map(file => {
    const filePath = path.join(outputPath, file);
    const fileData = fs.readFileSync(filePath);

    const segmentParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME_H,
      Key: `courses/${lessonId}/${file}`,
      Body: fileData,
      ContentType: 'video/MP2T'
    };

    return s3.upload(segmentParams).promise();
  });

  await Promise.all(uploadPromises);

  // Convert lessonId to ObjectId



  // Save index file URL to database
  try {
    const course = await Course.findById(lessonId);
    if (course) {
      course.videoSegments.push({
        // segmentPath: `courses/${lessonId}/segment%03d.ts`,
        indexFile: `courses/${lessonId}/index.m3u8`
      });
      await course.save();
      console.log(`index.m3u8 path saved to database for lessonId: ${lessonId}`);
    } else {
      console.error(`Course with id ${lessonId} not found`);
    }
  } catch (err) {
    console.error(`Failed to save index.m3u8 path to database: ${err.message}`);
  }
}

exports.uploadVideo = (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload video' });
    }

    const videoPath = req.file.path;
    const lessonId = req.body.lessonId; // Assuming lessonId is passed in the request body

    try {
      // Process video using ffmpeg
      await processVideo(videoPath, lessonId);

      // Respond to client with success message and lessonId
      res.json({
        message: 'Video uploaded and processed successfully.',
        lessonId: lessonId
      });
      
    } catch (err) {
      console.error(`Error during video processing: ${err.message}`);
      res.status(500).json({ error: 'Video processing failed' });
    }
  });
};


exports.checkStatus = async (req, res) => {
  const { lessonId } = req.params;

  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required' });
  }

  const checkInterval = 5000; // Check every 5 seconds
  const timeout = 60000; // Timeout after 60 seconds

  const checkFiles = async () => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME_H,
      Prefix: `courses/${lessonId}/`
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      if (data.Contents.length > 0) {
        const files = data.Contents.map(item => item.Key);
        return files;
      }
    } catch (err) {
      console.error(`Error checking status: ${err}`);
    }
    return null;
  };

  const pollStatus = async (startTime) => {
    const files = await checkFiles();
    if (files) {
      return res.status(200).json({ lessonId, files });
    } else if (Date.now() - startTime > timeout) {
      return res.status(408).json({ error: 'Request timeout' });
    } else {
      setTimeout(() => pollStatus(startTime), checkInterval);
    }
  };

  pollStatus(Date.now());
};


async function getPresignedUrl(courseId, segmentId) {
  try {

    const course = await Course.findById(courseId);
    console.log("🚀 ~ getPresignedUrl ~ course:", course)
    if (!course) {
      throw new Error('Course not found');
    }

    const videoSegment = course.videoSegments.find(segment => segment._id.toString() === segmentId);

    if (!videoSegment) {
      throw new Error('Video segment not found');
    }

    const indexFilePath = videoSegment.indexFile; 

    // Generate presigned URL for the index file
    const params = {
      Bucket: "krishanacademylms",
      Key: indexFilePath,
      Expires: 3600,
    };

    const presignedUrl = await s3.getSignedUrlPromise('getObject', params);
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error.message);
    throw error; // Re-throw for handling in API route or client
  }
}


exports.getVideo = async (req, res) => {
  const { courseId, segmentId } = req.body

  try {
    const presignedUrl = await getPresignedUrl(courseId, segmentId);
    res.json({ presignedUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get video URL' });
  }
};





function clearUploadsFolder() {
  const uploadDir = path.join(__dirname, 'uploads');
  
  if (fs.existsSync(uploadDir)) {
    const deleteFolderRecursive = (folderPath) => {
      if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
          const currentPath = path.join(folderPath, file);
          if (fs.lstatSync(currentPath).isDirectory()) {
            // Recursively delete subdirectory
            deleteFolderRecursive(currentPath);
          } else {
            // Delete file
            fs.unlinkSync(currentPath);
          }
        });
        fs.rmdirSync(folderPath);
      }
    };

    deleteFolderRecursive(uploadDir);
    console.log('All files and folders in the uploads directory have been deleted.');
  } else {
    console.log('Uploads directory does not exist.');
  }
}