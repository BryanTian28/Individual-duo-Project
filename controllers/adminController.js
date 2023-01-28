// Import Sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");

// Import models
const db = require("./../models/index");
const users = db.users;
const books = db.books;
const cart = db.cart;

// Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

// Import jwt
const { createToken } = require("./../lib/jwt");

module.exports = {
  createBook: async (req, res) => {
    try {
      let { title, author, publish_year, publisher, genre, pages } = req.body;
      let findDuplicate = await books.findOne({
        where: {
          [Op.and]: [{ title }, { author }, { publish_year }],
        },
      });

      if (findDuplicate !== null) {
        res.status(404).send({
          isError: true,
          message: "Book already exists in catalogue",
          data: null,
        });
      }

      let created = await books.create({
        title,
        author,
        publish_year,
        publisher,
        genre,
        pages,
      });

      res.status(200).send({
        isError: false,
        message: "Book added to catalogue",
        data: created,
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteBook: async (req, res) => {
    try {
      let { id } = req.params;

      await books.destroy({
        where: { id: id },
      });
      res.status(200).send({
        isError: false,
        message: "Book successfully deleted",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateBook: async (req, res) => {
    try {
      let { id } = req.params;
      let input = req.body;

      let data = {};
      for (const [key, value] of Object.entries(input)) {
        if (value !== null) {
          data[key] = value;
        }
      }
      let updated = await books.update(data, { where: { id: id } });

      res.status(200).send({
        isError: false,
        message: "Book details updated",
        data: updated,
      });
    } catch (error) {
      console.log(error);
    }
  },

  checkCart: async (req, res) => {
    try {
      let data = await cart.findAll();
      res.status(200).send({
        isError: false,
        message: "Transaction list obtained",
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
