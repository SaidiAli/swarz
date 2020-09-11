const { DataTypes } = require("sequelize");
const sequelize = require("../sql");

// Comment schema
const Comment = sequelize.define("Comment", {
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 500],
        msg: "The minimum number or characters is 1 and maximum is 500",
      },
    },
  },
  movie_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING,
    validate: {
      isIPv4: true,
    },
  },
});

module.exports = Comment;
