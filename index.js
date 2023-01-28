const express = require("express");
const app = express();
app.use(express.json()); // Body Parser: Mengambil data yang dikirimkan oleh client melalui body

const cors = require("cors");
app.use(cors());

const PORT = 5004;

// ### Sequelize Synchronous
// const Sequelize = require("sequelize");
// const Models = require("./models");
// Models.sequelize
//   .sync({
//     force: false,
//     alter: true,
//     logging: console.log,
//   })
//   .then(function () {
//     console.log("Database is Synchronized!");
//   })
//   .catch(function (err) {
//     console.log(err, "Something Went Wrong with Database Update!");
//   });

// app.get("/", (req, res) => {
//   res.status(201).send("<h1>Welcome to JCWD-2302 API</h1>");
// });

// Import Router
const { usersRouter, busRouter } = require("./routers");

app.use("/users", usersRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => console.log(`API Running on Port ${PORT}`));
