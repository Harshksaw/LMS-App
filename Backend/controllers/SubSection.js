const SubSection = require("../models/SubSection");
// const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const fs = require('fs');

//createSubSection => handler function



const mergeChunks = async (fileName, totalChunks) => {  
  const chunkDir = __dirname + "/chunks";  
  const mergedFilePath = __dirname + "/merged_files";  

  if (!fs.existsSync(mergedFilePath)) {  
      fs.mkdirSync(mergedFilePath);  
  }  

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);  

  // Use a promise to wait for all chunks to finish writing  
  return new Promise((resolve, reject) => {  
      writeStream.on('finish', () => {  
          console.log("Chunks merged successfully");  
          resolve();  
      });  

      writeStream.on('error', (err) => {  
          console.error("Error writing merged file:", err);  
          reject(err);  
      });  

      (async () => {  
          for (let i = 0; i < totalChunks; i++) {  
              const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;  
              const chunkBuffer = await fs.promises.readFile(chunkFilePath);  
              writeStream.write(chunkBuffer);  
              fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging  
          }  
          writeStream.end();  
      })().catch(reject);  
  });  
};
exports.createSubSection = async (req, res) => {
  console.log("Hit");
  const chunk = req.file.buffer;
  const chunkNumber = Number(req.body.chunkNumber); // Sent from the client
  const totalChunks = Number(req.body.totalChunks); // Sent from the client
  const fileName = req.body.originalname;

  const chunkDir = __dirname + "/chunks"; // Directory to save chunks

  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir);
  }

  const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

  try {
    await fs.promises.writeFile(chunkFilePath, chunk);
    console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

    if (chunkNumber === totalChunks - 1) {
      // If this is the last chunk, merge all chunks into a single file
      await mergeChunks(fileName, totalChunks);
      console.log("File merged successfully");
    }

    res.status(200).json({ message: "Chunk uploaded successfully" });
  } catch (error) {
    console.error("Error saving chunk:", error);
    res.status(500).json({ error: "Error saving chunk" });
  }



    // try{
    //     //fetching.. data
    //     // const {sectionId, title, timeDuration, description} = req.body;
    //     const {sectionId, title, description} = req.body;
    //     //extracting... file
    //     // const video = req.files.videoFile;
    //     console.log(req.file)
    //     const video = req.file.video;
    //     console.log(video)

        



    //     //validation...
    //     // if(!sectionId || !title || !timeDuration || !description || !video){
    //     //     return res.status(400).json({
    //     //         success : false,
    //     //         message : "all fields are REQUIRED !!",
    //     //     })
    //     // }
    //     if(!sectionId || !title || !description || !video){
    //       return res.status(400).json({
    //           success : false,
    //           message : "all fields are REQUIRED !!",
    //       })
    //     }

    //     //uploading.. video to cloudinary
    //     const uploadDetails = await uploadImageToCloudinary(
    //                   video, process.env.FOLDER_NAME);

    //     // creating ... a subsection
    //     const subSectionDetails = await SubSection.create({
    //         title:title,
    //         // timeDuration:timeDuration,
    //         timeDuration: `${uploadDetails.duration}`,
    //         description:description,
    //         videoUrl:uploadDetails.secure_url,
    //     })

    //     //updating... section 
    //     const updatedSection = await Section.findByIdAndUpdate(
    //         {_id:sectionId}, 
    //         {
    //             $push:{
    //                 subSection:subSectionDetails._id,
    //             }
    //         },
    //         {
    //             new:true
    //         },                                                  
    //     ).populate("subSection");//TODO ---=> LOG UPDATED SECTION HERE AFTER POPULATE QUERY 

    //     //sending.. final response
    //     return res.status(200).json({
    //         success : true,
    //         message : "subSection created SUCCESSFULLY !!",
    //         data: updatedSection,
    //     })

    // } catch(error){
    //     return res.status(500).json({
    //         success : false,
    //         message : "error ocurred while creating SUB-SECTION !!",
    //         error:error.message,
    //     })
    // }
}

//HW    <=----=====        
//updateSubSection => handler function
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.videoFile !== undefined) {
        const video = req.files.videoFile;
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  
  //deleteSubSection => handler function
  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data: updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }