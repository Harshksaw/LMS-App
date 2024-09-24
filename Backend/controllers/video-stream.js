const multer = require('multer');
const { exec } = require('child_process');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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

exports.uploadVideo = (req, res) => {
  upload.single('video')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload video' });
    }

    const videoPath = req.file.path;
    const lessonId = uuidv4();

    // Add task to queue
    queue.push({ videoPath, lessonId });

    res.json({
      message: 'Video uploaded successfully. Processing will start shortly.',
      lessonId: lessonId
    });
  });
};

const queue = [];

// Worker to process the queue
setInterval(() => {
  if (queue.length > 0) {
    const { videoPath, lessonId } = queue.shift();
    processVideo(videoPath, lessonId);
  }
}, 1000);

function processVideo(videoPath, lessonId) {
  const outputPath = path.join(__dirname, 'uploads', 'courses', lessonId);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  const hlsPath = `${outputPath}/index.m3u8`;

  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
      return;
    }

    // Upload index.m3u8 to S3
    fs.readFile(hlsPath, (err, data) => {
      if (err) {
        console.log(`readFile error: ${err}`);
        return;
      }

      const params = {
        Bucket: "krishanacademylms",
        Key: `courses/${lessonId}/index.m3u8`,
        Body: data,
        ContentType: 'application/vnd.apple.mpegurl'
      };

      s3.upload(params, (s3Err, s3Data) => {
        if (s3Err) {
          console.log(`s3 upload error: ${s3Err}`);
          return;
        }

        const videoUrl = s3Data.Location;

        // Upload segment files to S3
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

        Promise.all(uploadPromises)
          .then(results => {
            const segmentUrls = results.map(result => result.Location);
            console.log({
              message: "Video converted to HLS format and uploaded to S3",
              videoUrl: videoUrl,
              segmentUrls: segmentUrls,
              lessonId: lessonId
            });
          })
          .catch(uploadErr => {
            console.log(`segment upload error: ${uploadErr}`);
          });
      });
    });
  });
}