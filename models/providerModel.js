const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Int32 } = require("mongodb");

const providerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "Please Enter Your First Name"],
    maxLength: [30, "First name cannot exceed 30 characters"],
    minLength: [2, "First name should have more than 2 characters"],
  },
  lname: {
    type: String,
    required: [true, "Please Enter Your Last Name"],
    maxLength: [30, "Last name cannot exceed 30 characters"],
    minLength: [2, "Last name should have more than 2 characters"],
  },
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
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  isApproved:{
    type: Int32,
    default: 0
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "provider",
  },
  phone: {
    type: String,
    required: [true, "Please Enter Your Phone Number"],
    minLength: [10, "Phone number should be 10 numbers"],
  },
  schoolyear: {
    type: String,
    required: [true, "Please Enter Your Phone Number"],
  },
  address: {
    type: String,
    required: [true, "Please Enter Your Address"],
  },
  // pincode: {
  //   type: String,
  //   required: [true, "Please Enter Your Pincode"],
  //   minLength: [5, "Pincode should be 5 numbers"],
  // },
  // currlocation: {
  //   type: String,
  //   required: [true, "Please Enter Your Current Location"],
  // },
  recentpasswordchange: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
providerSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

providerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
providerSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("Provider", providerSchema);
