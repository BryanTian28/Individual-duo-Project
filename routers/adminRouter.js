const express = require("express");
const Router = express.Router();

// Import All Controller
const { adminController } = require("../controllers"); // Akan otomatis mengambil file index.js nya

Router.post("/addBook", adminController.createBook);
Router.post("/updateBook/:id", adminController.updateBook);
Router.delete("/deleteBook/:id", adminController.deleteBook);
Router.get("/getLoans", adminController.checkCart);

module.exports = Router;
