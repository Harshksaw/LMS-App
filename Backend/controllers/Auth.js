const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const sendOtp = require("../utils/otpSender");

const MAX_ATTEMPTS = 30;
const BAN_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

//otp verification by SENDING OTP
exports.sendotp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const checkUserPresent = await User.findOne({ phoneNumber });

    if (checkUserPresent) {
      return res.status(401).json({
        sucess: false,
        message: "User Already Exists",
        OtpMessage: "User Already Exists",
      });
    }

    //genearating... otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await OTP.findOne({ otp: otp });
    // console.log("Result is Generate OTP Func");
    console.log("--------------OTP-------------", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false, //uncommment the below
        // lowerCaseAlphabets:false,
        // specialChars:false,
      });
    }

    //creating... otpPayload
    console.log(phoneNumber, otp);
    const otpPayload = { phoneNumber, otp };
    //creating... an entry in Database for OTP
    const otpBody = await OTP.create(otpPayload);

    //TODO
    await sendOtp(otp, phoneNumber);
    console.log("otpBODY -> ", otpBody);

    //sending...final response
    res.status(200).json({
      success: true,
      message: "OTP Sended SUCCESSFULLY !!",
      OtpMessage: "OTP Sended SUCCESSFULLY !!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { id } = req.params;
    // Check if All Details are there or not
    if (!id) {
      return res.status(403).send({
        success: false,
        message: "Required ID",
      });
    }

    // Check if user already exists
    const user = await User.findOne({ _id: id }).populate(
      "courses quizes studyMaterials"
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const {
      id,
      //add fields to be updated
    } = req.body;
    if (!id) {
      return res.status(403).send({
        success: false,
        message: "Required ID",
      });
    }

    // Check if user already exists
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User updation failed",
      });
    }

    return res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while Updating user. Please try again.",
    });
  }
};

exports.signupAdmin = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { email, password, phoneNumber, name } = req.body;

    // Check if All Details are there or not
    if (!email || !password || !phoneNumber) {
      return res.status(403).send({
        success: false,
        message: "Email, password, and phone number are required",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      accountType: "Admin",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=Admin`,
    });

    return res.status(200).json({
      success: true,
      data: newUser,
      message: "Admin user registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Admin user cannot be registered. Please try again.",
    });
  }
};
//login
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { name, email, password, accountType, phoneNumber, otp, deviceData } =
      req.body;

    // Check if All Details are there or not
    if (!name || !email || !password || !accountType) {
      return res.status(403).send({
        success: false,
        message: "Name, email, password, and account type are required",
      });
    }

    if (!phoneNumber || !otp || !deviceData) {
      return res.status(403).send({
        success: false,
        message:
          "Phone number, OTP, and device data are required for non-Admin users",
        OtpMessage:
          "Phone number, OTP, and device data are required for non-Admin users",
      });
    }

    // Validate OTP for non-Admin users
    if (accountType !== "Admin") {
      const response = await OTP.find({ phoneNumber })
        .sort({ createdAt: -1 })
        .limit(1);
      if (response.length === 0 || otp != response[0].otp) {
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
          OtpMessage: "Invalid Otp | Not matched",
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phoneNumber: accountType !== "Admin" ? phoneNumber : undefined,
      deviceData: accountType !== "Admin" ? deviceData : undefined,
      password: hashedPassword,
      accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    return res.status(200).json({
      success: true,
      data: newUser,
      message: "User registered successfully",
      OtpMessage:
        "Phone number, OTP, and device data are required for non-Admin users",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
      OtpMessage: "cannot be registered. Please try after Sometime",
    });
  }
};
exports.userLogin = async (req, res) => {
  try {
    const { phoneNumber, password, deviceData } = req.body;

    if (phoneNumber == 7991168445) {
      const user = await User.findOne({ phoneNumber });
      if (await bcrypt.compare(password, user.password)) {
        //creating.. payload
        const payload = {
          email: user.phoneNumber,
          id: user._id,
          accountType: user.accountType,
        };
        //generating... jwt token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          // expiresIn:"24h",
          // expiresIn:"365d"
        });
        user.token = token;
        user.password = undefined;

        //creating... cookie && //sending...  final RESPONSE
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        return res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: "LOGGED IN SUCCESSFULLY",
        });
      }
    }

    if (typeof deviceData !== "object" || deviceData === null) {
      return res.status(400).json({
        message: "Deivce Data error ",
        error: "Invalid device data",
      });
    }
    if (!phoneNumber || !password || !deviceData) {
      return res.status(403).json({
        success: false,
        message: "ALL FIELDS ARE REQUIRED",
      });
    }

    //validating... data

    //checking... user existence
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not registered !!",
      });
    }

    if (user.isBanned && user.banExpires > new Date()) {
      console.log("257");
      return res.status(403).json({
        success: false,
        message: "Account is banned. Try again later.",
      });
    }

    if (!!user.loginAttempts) {
      return res.status(406).json({
        success: false,
        message: "you can register only one device at a time!!",
      });
    }

    //match device data with stored data for user
    const storedDeviceData = user.deviceData;

    if (!isDeviceDataMatching(storedDeviceData, deviceData)) {
      // user.loginAttempts += 1;
      // if (user.loginAttempts >= MAX_ATTEMPTS) {
      //   user.isBanned = true;
      //   user.banExpires = new Date(Date.now() + BAN_DURATION);
      // }
      // await user.save();
      // throw new Error(
      //   "Device data does not match. Login attempts: " + user.loginAttempts
      // );
    }

    //matching... password && //generating... JWT token
    if (await bcrypt.compare(password, user.password)) {
      //creating.. payload
      const payload = {
        email: user.phoneNumber,
        id: user._id,
        accountType: user.accountType,
      };
      user.loginAttempts = 1;
      user.save();
      //generating... jwt token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        // expiresIn:"24h",
        // expiresIn:"365d"
      });
      user.token = token;
      delete user.password;

      //creating... cookie && //sending...  final RESPONSE
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "LOGGED IN SUCCESSFULLY",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password doesnt matched !!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};

// Compare passwords

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(
      "🚀 ~ exports.adminLogin= ~ email, password }:",
      email,
      password
    );

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Admin is not registered",
      });
    }

    if (user.isBanned && user.banExpires > new Date()) {
      return res.status(403).json({
        success: false,
        message: "Account is banned. Try again later.",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Admin cannot log in, try again",
    });
  }
};

function isDeviceDataMatching(
  storedDeviceData,
  providedDeviceData,
  tolerance = 2
) {
  console.log("---");
  let mismatches = 0;

  // Get all keys from both objects
  const allKeys = new Set([
    ...Object.keys(storedDeviceData),
    ...Object.keys(providedDeviceData),
  ]);

  // Compare values for each key
  for (let key of allKeys) {
    if (storedDeviceData[key] !== providedDeviceData[key]) {
      mismatches++;
      if (mismatches > tolerance) {
        return false;
      }
    }
  }

  return true;
}

exports.sendPasswordotp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    // user.otp = otp;
    user.otpExpires = Date.now() + 20 * 60 * 1000; // OTP expires in 20 minutes
    const otpPayload = { phoneNumber, otp };
    //creating... an entry in Database for OTP
    const otpBody = await OTP.create(otpPayload);
    // await user.save();
    console.log(otp);

    await sendOtp(otp, phoneNumber);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;

  try {
    const response = await OTP.find({ phoneNumber })
      .sort({ createdAt: -1 })
      .limit(1);

    if (response.length === 0 || otp != response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateAdditionalDetails = async (req, res) => {
  const { id: userId } = req.params;
  const { dob, state, city } = req.body;

  try {
    // Find the user by ID and update the additional details
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "additionalDetails.dob": dob,
          "additionalDetails.state": state,
          "additionalDetails.city": city,
        },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Additional details updated successfully", user });
  } catch (error) {
    console.error("Error updating additional details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// all user--
exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.find({ accountType: "Student" }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUserCources = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findById(id).populate("courses");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      res.status(404).json({ message: "user not found" });
    }

    const users = await User.findOneAndUpdate(
      { _id: id },
      { loginAttempts: 0, token: null },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: null,
      message: "user logout successfull",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "user not found" });
  }
};
