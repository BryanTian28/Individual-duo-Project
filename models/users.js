"use strict";
const { Model } = require("sequelize");
const books = require("./books");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.books, { through: "cart" });
    }
  }
  users.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: { type: DataTypes.STRING, defaultValue: "user" },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
