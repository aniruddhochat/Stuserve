const express = require("express");
const {
  registerProvider,
  loginProvider,
  logout,
  forgotPassword,
  resetPassword,
  getProviderDetails,
  updatePassword,
  updateProfile,
  getAllProvider,
  getSingleProvider,
  updateProviderRole,
  deleteProvider,
} = require("../controllers/providerController");
const {
  isAuthenticatedProvider,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

router.route("/registerprovider").post(registerProvider);

router.route("/loginprovider").post(loginProvider);

router.route("/password/forgotprovider").post(forgotPassword);

router.route("/password/resetprovider/:token").put(resetPassword);

router.route("/logoutprovider").get(logout);

router.route("/meprovider").get(isAuthenticatedProvider, getProviderDetails);

router
  .route("/password/updateprovider")
  .put(isAuthenticatedProvider, updatePassword);

router.route("/me/updateprovider").put(isAuthenticatedProvider, updateProfile);

router
  .route("/admin/provider")
  .get(isAuthenticatedProvider, authorizeRoles("admin"), getAllProvider);

router
  .route("/admin/provider/:id")
  .get(isAuthenticatedProvider, authorizeRoles("admin"), getSingleProvider)
  .delete(isAuthenticatedProvider, authorizeRoles("admin"), deleteProvider);

module.exports = router;