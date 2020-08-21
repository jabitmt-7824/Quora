const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// for login page
router.get("/", userController.loginPage);

// for user routes
router.use("/user", require("./users"));

module.exports = router;