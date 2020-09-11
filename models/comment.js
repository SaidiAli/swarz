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

Comment.sync({
  force: false,
  logging: false
})
.then(() => {
  Comment.create({
    comment: "Test Comment",
    movie_title: "A New Hope",
    ip_address: "127.1.1.1"
  })
})
.catch((error)=> {
  console.error('Error creating comments tabel', error)
})

module.exports = Comment;
