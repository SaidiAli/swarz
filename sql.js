const { Sequelize } = require("sequelize");
const db = process.env.DATABASE || 'anything'
const username = process.env.UNAME || 'root'
const password = process.env.PASSWORD || ''
const host = process.env.HOST || 'localhost'

// create connection
const sequelize = new Sequelize(db, username, password, {
  host,
  dialect: "mysql",
});

module.exports = sequelize
