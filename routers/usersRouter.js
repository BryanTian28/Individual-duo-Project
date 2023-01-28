const express = require("express");
const Router = express.Router();

// Import All Controller
const { usersController } = require("../controllers"); // Akan otomatis mengambil file index.js nya

Router.post("/register", usersController.register);
Router.get("/login", usersController.login);

module.exports = Router;
