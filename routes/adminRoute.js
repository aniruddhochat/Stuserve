const express = require("express");
const {
    getAllAdminProviders,
    adminDeleteProvider,
    adminGetAllServicesApproval,
    adminDeleteService,
    approveProvider,
    approveService,
    createAdmin,
    getAllAdmins
} = require("../controllers/adminController");
const {
  isAuthenticatedProvider,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

router.route("/getAllAdmins").get(getAllAdmins);

router.route("/createAdmin").post(createAdmin);

router.route("/getAllAdminProviders").get(getAllAdminProviders);

router.route("/adminDeleteProvider").post(adminDeleteProvider);

router.route("/adminGetAllServicesApproval").get(adminGetAllServicesApproval);

router.route("/adminDeleteService").post(adminDeleteService);

router.route("/approveProvider").post(approveProvider);

router.route("/approveService").post(approveService);


// // Unauthorized view providers (hides important provider info like password)
// router.route("/providerdetails/:id").get(getProviderDetails);
// router.route("/providerdetails").get(getAllProviderDetails);

// router
//   .route("/password/updateprovider")
//   .put(isAuthenticatedProvider, updatePassword);

// router.route("/me/updateprovider").put(isAuthenticatedProvider, updateProfile);

// router
//   .route("/admin/provider")
//   .get(isAuthenticatedProvider, authorizeRoles("admin"), getAllProvider);

// router
//   .route("/admin/provider/:id")
//   .get(isAuthenticatedProvider, authorizeRoles("admin"), getSingleProvider)
//   .delete(isAuthenticatedProvider, authorizeRoles("admin"), deleteProvider);

module.exports = router;