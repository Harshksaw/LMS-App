const Bundle = require("../models/CourseBundle");
const Quiz = require("../models/Quiz");
const StudyMaterial = require("../models/material");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const User = require("../models/User");
const Coupon = require("../models/coupons");
const { default: mongoose } = require("mongoose");

console.log(
  process.env.CLOUD_NAME,
  process.env.API_KEY,
  process.env.API_SECRET
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,

  api_secret: process.env.API_SECRET,
});
// Create a new course bundle
exports.createCourseBundle = async (req, res) => {
  try {
    //   console.log(req.file.path, "----");

    const response = await cloudinary.uploader.upload(req.file.path, {
      folder: "images",
    });
    // console.log("🚀 ~ exports.createCourseBundle= ~ response:", response)

    const bundle = new Bundle({
      bundleName: req.body.bundleName,
      image: response.secure_url,

      price: req.body.price,
      aboutDescription: req.body.aboutDescription,
      status: "Draft",
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
    if (!bundle) {
      return res.status(404).json({ error: "Course bundle not found" });
    }

    if (!!req.body.quizzes.length || !!Object.keys(req.body.quizzes).length) {
      req.body?.quizzes.map((item) => {
        if (!bundle.quizes.some((i) => i == item)) {
          bundle.quizes.push(item);
        }
      });
    }
    await bundle.save();

    res.status(200).json({
      message: "Quizzes added to course bundle successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourseBundle = async (req, res) => {
  try {
    console.log("🚀 ~ exports.deleteCourseBundle ~ id:", req.params.id);
    const bundle = await Bundle.findByIdAndDelete(req.params.id);
    console.log(bundle);
    if (!bundle) {
      return res.status(404).json({ error: "Course bundle not found" });
    }

    // Delete related quizzes
    // await Quiz.deleteMany({ _id: { $in: bundle.quizes } });

    // Delete related study materials
    // await StudyMaterial.deleteMany({ _id: { $in: bundle.studyMaterials } });

    // Delete the related course
    await Course.findByIdAndDelete(bundle.course);

    // Delete the bundle itself
    await bundle.remove();

    res.status(200).json({
      message: "Course bundle deleted successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTimenListing = async (req, res) => {
  try {
    console.log(req.params.id);
    const dateObject = new Date(req.body.date);
    console.log(dateObject);
    const bundle = await Bundle.findByIdAndUpdate(
      { _id: req.params.id },
      {
        listed: req.params.isListed,
        activeListing: dateObject,
        status: "Published",
      }
    );

    if (!bundle) {
      return res.status(404).json({ error: "Course bundle not found" });
    }

    await bundle.save();

    res.status(200).json({
      message: "Quizzes added to course bundle successfully",
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
      return res.status(404).json({ error: "Course bundle not found" });
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

exports.getCourseBundle = async (req, res) => {
  try {



    
    const currentDate = new Date();
    const bundles = await Bundle.find({
      status: "Published",
      activeListing: { $lte: currentDate },
      
      
    }).sort({ created: -1 });
    if (bundles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course bundle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cours ebundles",
      data: bundles || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
};


exports.getAdminCourseBundle = async (req, res) => {
  try {
    const currentDate = new Date();
    const bundles = await Bundle.find({
      status: "Published",

    }).sort({ created: -1 });
    // const bundles = await Bundle.find({status:"Published"}).sort({created:-1}).populate('quizes').populate('studyMaterials');
    res.status(200).json({
      success: true,
      message: "Cours ebundles",
      data: bundles || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCourseBundle = async (req, res) => {
  try {
    const bundles = await Bundle.find({ status: "Published" }).sort({
      createdAt: -1,
    });
    // const bundles = await Bundle.find({status:"Published"}).sort({created:-1}).populate('quizes').populate('studyMaterials');
    res.status(200).json({
      success: true,
      message: "Course bundles",
      data: bundles || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourseBundleById = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id)
      .populate("quizes")
      .populate("studyMaterials")
      .populate("Videos");

    res.status(200).json({
      success: true,
      message: `CourseBundle ${req.params.id}`,
      data: bundle || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.assignCourseBundle = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: { courses: courseId },
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.save();

    res
      .status(200)
      .json({ message: "Course assigned successfully ", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserQuizzes = async (req, res) => {
  try {
    const { id } = req.params;

    const { courses } = await User.findById(id)
      .populate({
        path: "courses",
        populate: {
          path: "quizes",
          model: "Quiz",
        },
      })
      .select("courses")
      .sort({ created: -1 })
      .lean();

    let allQuizzes = [];
    courses.forEach((item) => {
      item.quizes.forEach((quiz) => {
        if (!allQuizzes.some((i) => i._id == quiz._id)) {
          allQuizzes.push(quiz);
        }
      });
    });

    res.status(200).json({
      success: true,
      data: allQuizzes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllUserBundles = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ exports.getUserQuizzes= ~ id:", id);

    const user = await User.findById(id).populate("courses").sort({ created: -1 });

    if (!user.courses || user.courses.length === 0) {
      return res.status(202).json({
        success: true,
        message: "No courses found for this user",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkPurchase = async (req, res) => {
  const { userId, courseId } = req.body;
  console.log(
    "🚀 ~ exports.checkPurchase= ~ userId, courseId",
    userId,
    courseId
  );

  try {
    const user = await User.findOne({ _id: userId, courses: courseId }).lean();

    if (!user) {
      return res.status(404).json({ message: "Course not found for the user" });
    }
    res.status(200).json({ message: "Course exists for the user", data: user });
  } catch (error) {
    console.error("Error checking course ID:", error);
    throw error;
  }
};

exports.removeUserBundle = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId).populate("courses");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the course in the user's course bundle
    const courseIndex = user.courses.findIndex(
      (course) => course._id.toString() === courseId
    );

    if (courseIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found in user bundle" });
    }

    // Remove the course from the user's course bundle
    user.courses.splice(courseIndex, 1);

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Course removed from user bundle" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateBundle = async (req, res) => {
  try {
    const { bundleName, price, aboutDescription } = req.body;
    const { id } = req.params;

    const update = {};
    if (!!bundleName) {
      update.bundleName = bundleName;
    }
    if (!!price) {
      update.price = price;
    }
    if (!!aboutDescription) {
      update.aboutDescription = aboutDescription;
    }
    // Find the user by ID
    const user = await Bundle.findByIdAndUpdate(id, update, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "bundle updated successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateVideo = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);

    if (!bundle) {
      return res.status(404).json({ error: "Course bundle not found" });
    }

    // Ensure each video ID is cast to ObjectId
    const videoIds = req.body.video.map(videoId => new  mongoose.Types.ObjectId(videoId));

    bundle.Videos.push(...videoIds);

    await bundle.save();

    res.status(200).json({
      message: "Video added to course bundle successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};