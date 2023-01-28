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
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, password, role } = req.body;

      if (role === null) {
        role = "user";
      }

      await users.create({
        username,
        email,
        password: await hashPassword(password),
        role,
      });

      res.status(201).send({
        isError: false,
        message: "Register Success",
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.errors[0].message,
        data: null,
      });
    }
  },

  login: async (req, res) => {
    try {
      let { usernameOrEmail, password } = req.query;

      //TODO: Validasi length password

      let findUsernameOrEmail = await users.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });
      if (!findUsernameOrEmail) {
        res.status(404).send({
          isError: true,
          message: "Username or Email not found",
          data: null,
        });
      }

      let hashMatchResult = await hashMatch(
        password,
        findUsernameOrEmail.dataValues.password
      );

      if (hashMatchResult === false) {
        res.status(404).send({
          isError: true,
          message: "Password not valid",
          data: null,
        });
      }

      if (findUsernameOrEmail.dataValues.role == "user") {
        res.status(200).send({
          isError: false,
          message: "User Login Success",
          data: {
            token: createToken({ id: findUsernameOrEmail.dataValues.id }),
          },
        });
      } else {
        res.status(200).send({
          isError: false,
          message: "Admin Login Success",
          data: {
            token: createToken({ id: findUsernameOrEmail.dataValues.id }),
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  addToLoanCart: async (req, res) => {
    try {
      let { id } = req.params;
      let { idUser } = req.dataDecode;

      let findInCart = await cart.findOne({
        where: {
          [Op.and]: [{ users_id: idUser }, { books_id: id }],
        },
      });

      if (findInCart !== null) {
        res.status(400).send({
          isError: true,
          message: "Book already exists in cart",
          data: null,
        });
      }

      let insertLoan = await cart.create({
        expiry: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: "On Loan",
      });

      await sequelize.query(
        `CREATE EVENT change_status_loan_${insertLoan.id}
      ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 5 day)
      DO
      UPDATE cart SET status = "Penalty"
      WHERE id = ?;`,
        { replacements: [insertLoan.id] }
      );

      res.status(200).send({
        isError: false,
        message: "Loan accepted",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
