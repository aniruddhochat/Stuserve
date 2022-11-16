const express = require("express");
const {
  createCategory,
  getCategory,
} = require("../controllers/categoryController");
const {
  isAuthenticatedProvider,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

router.route("/getcategory").get(getAllCategory);

router.route("/admin/category/new").post(createCategory);

module.exports = router;
