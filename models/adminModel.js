//Approve and dis-apporve
const mongoose = require("mongoose");
const Provider = require("../models/providerModel");




const adminSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    username: {
      type: String,
      required: [true, "Please Generate Your Unique Username"],
      unique: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    recentpasswordchange: {
      type: Boolean,
      default: false,
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
  });

