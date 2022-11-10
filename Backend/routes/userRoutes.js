const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login/", userController.login);

router.get("/users/", userController.getAllUsers);

router.get("/users/currentUser", userController.getCurrentUser);

router.get("/users/id/:id", userController.getUserById);

router.get("/users/username/:username", userController.getUserByName);

router.post("/register/", userController.register);

router.put("/users/", userController.updateUser);

module.exports = router;
