


const Bundle = require('../models/CourseBundle');
const Quiz = require('../models/Quiz');
const StudyMaterial = require('../models/material');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

console.log(
    process.env.CLOUD_NAME,
    process.env.API_KEY,
    process.env.API_SECRET
)

cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME,
     cloud_name: 'dbnnlqq5v', 
        api_key: '283514623947746',
    // api_key: process.env.API_KEY,
    api_secret: 'E2s6axKWvXTiJi5_DGiFuPe7Lxo',


  });
// Create a new course bundle
exports.createCourseBundle = async (req, res) => {
  try {

    //   console.log(req.file.path, "----");
      

    const response= await cloudinary.uploader.upload(req.file.path, {
        folder: 'images',
      })
    console.log("🚀 ~ exports.createCourseBundle= ~ response:", response)

    const bundle = new Bundle({
      bundleName: req.body.bundleName,
      image: response.secure_url,

      price: req.body.price,
      aboutDescription: req.body.aboutDescription,
      status: "Draft" ,

    });
    await bundle.save();
    res.status(201).json(bundle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add quizzes to a course bundle
exports.addQuizzesToBundle = async (req, res) => {
    try {

      const bundle = await Bundle.findById(req.params.id);
console.log(req.params.id, "----60")


      if (!bundle) {
        return res.status(404).json({ error: 'Course bundle not found' });
      }


      bundle.quizes.push(...req.body.quizzes);
     
      await bundle.save();

      res.status(200).json({
        message: 'Quizzes added to course bundle successfully',
        data: bundle,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.updateTimenListing = async (req, res) => {
    try {
      console.log(req.params.id)
const dateObject = new Date(req.body.date);
      console.log(dateObject)
      const bundle = await Bundle.findByIdAndUpdate({_id: req.params.id},{
        listed: req.params.isListed,
        activeListing: dateObject,
        status: "Published"
        
      });



      if (!bundle) {
        return res.status(404).json({ error: 'Course bundle not found' });
      }


     
      await bundle.save();

      res.status(200).json({
       
        message: 'Quizzes added to course bundle successfully',
        data: bundle,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Add study materials to a course bundle
  exports.addStudyMaterialsToBundle = async (req, res) => {
    try {
      const bundle = await Bundle.findById(req.params.id);
      if (!bundle) {
        return res.status(404).json({ error: 'Course bundle not found' });
      }
      bundle.studyMaterials.push(...req.body.studyMaterials);
      // if (bundle.quizes.length > 0 && bundle.studyMaterials.length > 0) {
      //   bundle.status = "Published"; // Update status to Published if both quizzes and study materials are added
      // }
      await bundle.save();
      res.status(200).json(bundle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // List all course bundles
 


  exports.getCourseBundle = async(req, res) => {
    try {
      const bundles = await Bundle.find({status:"Published"}).sort({created:-1})
      // const bundles = await Bundle.find({status:"Published"}).sort({created:-1}).populate('quizes').populate('studyMaterials');
      res.status(200).json({
        success:true,
        message:'Cours ebundles',
        data: bundles || [],
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  exports.getAllCourseBundle = async(req, res) => {
    try {
      const bundles = await Bundle.find().sort({createdAt:-1})
      // const bundles = await Bundle.find({status:"Published"}).sort({created:-1}).populate('quizes').populate('studyMaterials');
      res.status(200).json({
        success:true,
        message:'Course bundles',
        data: bundles || [],
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  
  exports.getCourseBundleById = async(req, res) => {
    try {

      const bundle = await Bundle.findById(req.params.id).populate('quizes').populate('studyMaterials');


      res.status(200).json({
        success:true,
        message:`CourseBundle ${req.params.id}`,
        data: bundle || [],
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


