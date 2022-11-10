const userSchema = require("../models/user");
const utils = require("../utils/utils");
const userDTO = require("../models/DTOs/userDTO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const upload = multer();

exports.register = async (req, res) => {
  if (utils.checkAPIKey(req.body.key, res)) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ error: "Missing parameters" });
    } else {
      const newUser = userSchema({
        username,
        password,
      });
      try {
        await newUser.save();
      } catch {
        return res.status(400).send({ error: "Username is already in use" });
      }
      let token;
      try {
        token = jwt.sign(
          {
            userId: newUser.id,
            username: newUser.username,
            admin: newUser.admin,
          },
          process.env.SECRET,
          { expiresIn: "1h" }
        );
      } catch (err) {
        return res
          .status(500)
          .send({ error: "Looks like something went wrong :(" });
      }
      return res.status(201).send("User created!");
    }
  }
};

exports.login = async (req, res) => {
  if (utils.checkAPIKey(req.body.key, res)) {
    let { username, password } = req.body;

    let existingUser;

    try {
      existingUser = await userSchema.findOne({ username: username });
    } catch {
      return res.status(500).send({ error: "Something went wrong" });
    }
    if (!existingUser) {
      return res.status(404).send({ error: "User not found" });
    }
    const auth = await bcrypt.compare(password, existingUser.password);

    if (!auth) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    let token;
    try {
      token = jwt.sign(
        {
          userId: existingUser.id,
          username: existingUser.username,
          admin: existingUser.admin,
        },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Looks like something went wrong :(" });
    }

    return res.status(200).json({ token: token });
  }
};

exports.getAllUsers = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    userSchema.find((error, users) => {
      if (error)
        return res
          .status(500)
          .send({ error: "Looks like something went wrong :(" });

      if (!error) return res.send(utils.convertUser(users));
    });
  }
};

exports.getCurrentUser = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    if (!req.headers.authorization) {
      return res.status(400).send({ error: "Token was not provided" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = userSchema({
        _id: decodedToken.userId,
        username: decodedToken.username,
        admin: decodedToken.admin,
      });
      return res.status(200).send(userDTO(user));
    } catch (error) {
      return res.status(400).send({ error: "Failed to verify token" });
    }
  }
};

exports.getUserById = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    userSchema.findOne({ _id: req.params.id }, function (error, user) {
      if (user == null)
        return res.status(404).send({
          error: "Looks like we couldn't find what you were looking for.",
        });
      if (error)
        return res
          .status(500)
          .send({ error: "Looks like something went wrong :(" });
      if (user != null) return res.send(userDTO(user));
    });
  }
};

exports.getUserByName = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    userSchema.findOne({ username: req.params.username }, function (error, user) {
      if (user == null)
        return res.status(404).send({
          error: "Looks like we couldn't find what you were looking for.",
        });
      if (error)
        return res
          .status(500)
          .send({ error: "Looks like something went wrong :(" });
      if (user != null) return res.send(userDTO(user));
    });
  }
};

exports.updateUser = (req, res) => {
  let getBody = upload.any();
  getBody(req, res, function () {
    if (utils.checkAPIKey(req.body.key, res)) {
      userSchema.findOneAndUpdate(
        { username: req.body.username },
        req.body,
        function (error, user) {
          if (user == null)
            return res.status(404).send({
              error: "Looks like we couldn't find the user you were looking for.",
            });
          if (error)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          if (user != null)
          if (user.admin) {
            return res.status(400).send({ error: "User already an admin." })
          }
          else {
            return res.status(200).send("User updated!");
          }
        }
      );
    }
  });
};
