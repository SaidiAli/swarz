const express = require("express")
const bodyParser = require('body-parser')
const moviesRouter = require('./routes/movies')
const charactersRouter = require('./routes/characters')
const sequelize = require('./sql')
const Comment = require('./models/comment')
const PORT = process.env.PORT || 3000;

// test connection to the database server
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}


app = express();

// middleware
app.use(bodyParser.json())
app.use('/movies', moviesRouter)
app.use('/characters', charactersRouter)

app.listen(PORT, () => console.log("Server Started ..."));
