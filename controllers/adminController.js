const Service = require("../models/serviceModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const object = require("mongodb");

const Provider = require("../models/providerModel");





// Get not Approved provider
exports.getAllAdminProviders = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.find({isApproved:0});
  
    res.status(200).json({
      success: true,
      provider,
    });
});

  // Delete Provider --Admin
exports.adminDeleteProvider = catchAsyncErrors(async (req, res, next) => {
    const provider = await Provider.findById(req.params.id);
  
    if (!provider) {
      return next(
        new ErrorHander(`Provider does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
    const imageId = provider.avatar.public_id;
  
    //   await cloudinary.v2.uploader.destroy(imageId);
  
    await provider.remove();
  
    res.status(200).json({
      success: true,
      message: "Provider Deleted Successfully",
    });
  });

  // Accept or delete Service
exports.adminGetAllServicesApproval = catchAsyncErrors(async (req, res, next) => {
  // const services = await Service.find();
  const services = await Service.find({
    isApproved:0
  });
  res.status(200).json({
    success: true,
    services,
  });
});

// Delete unapproved Service

exports.adminDeleteService = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHander("Service not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < service.images.length; i++) {
    await cloudinary.v2.uploader.destroy(service.images[i].public_id);
  }

  await service.remove();

  res.status(200).json({
    success: true,
    message: "Service Delete Successfully",
  });
});

// Update approval status for provider
exports.approveProvider = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    isApproved: 1,
  };
  const user = await Provider.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
});

// Update approval status for service
exports.approveService = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    isApproved: 1,
  };
  const user = await Service.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
});