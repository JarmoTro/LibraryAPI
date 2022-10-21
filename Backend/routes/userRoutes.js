const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login/", userController.login);

router.get("/users/", userController.getAllUsers);

router.get("/users/currentUser", userController.getCurrentUser);

router.get("/users/:id", userController.getUserById);

router.post("/register/", userController.register);

module.exports = router;
