"use strict";
const { Model } = require("sequelize");
const users = require("./users");
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.users, { through: "cart" });
    }
  }
  books.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      publish_year: DataTypes.INTEGER,
      publisher: DataTypes.STRING,
      genre: DataTypes.STRING,
      pages: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "books",
    }
  );
  return books;
};
