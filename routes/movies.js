const express = require("express");
const axios = require("axios").default;
const bodyParser = require("body-parser");
const Comment = require("../models/comment");

const moviesRouter = express.Router();
moviesRouter.use(bodyParser.json());

moviesRouter.route("/").get((req, res) => {
  let comment_count = 0;

  axios
    .get("https://swapi.dev/api/films")
    .then(function (response) {
      let { results } = response.data;

      let sortedResults = results.map(function (res) {
        Comment.findAll({
          where: {
            movie_title: res["title"],
          },
        })
          .then((comment) => {
            console.log(comment.length);
            comment_count = comment.length;
          })
          .catch((err) => {
            console.error("Failed to fetch comments:", err);
          });

        return {
          title: res["title"],
          opening_crawl: res["opening_crawl"],
          release_date: res["release_date"],
          comment_count,
        };
      });

      sortedResults.sort((movie1, movie2) => {
        let date1 = new Date(movie1.release_date);
        let date2 = new Date(movie2.release_date);

        if (date1 > date2) return 1;

        return 0;
      });

      return res.json({
        data: sortedResults,
      });
    })
    .catch(function (error) {
      return res.json({
        errors: { message: error.message },
      });
    });
});

moviesRouter
  .route("/commentS")
  .post((req, res) => {
    Comment.create(req.body)
      .then((comment) => {
        return res.json({
          data: comment,
        });
      })
      .catch((error) => {
        return res.json({
          errors: { message: error.message },
        });
      });
  })
  .get((req, res) => {
    Comment.findAll()
      .then((comments) => {
        comments.sort((comment1, comment2) => {
          let date1 = new Date(comment1.createdAt);
          let date2 = new Date(comment2.updatedAt);

          if (date1 < date2) return 1;

          return 0;
        });

        return res.json({
          data: comments,
          count: comments.length,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
      });
  });

moviesRouter.route("/:movieName").get((req, res) => {
  let comment_count = 0;

  axios
    .get("https://swapi.dev/api/films", {
      params: {
        search: req.params.movieName,
      },
    })
    .then((response) => {
      let { results } = response.data;

      let trimedResults = results.map(function (res) {
        Comment.findAll({
          where: {
            movie_title: res["title"],
          },
        })
          .then((comment) => {
            console.log(comment.length);
            comment_count = comment.length;
          })
          .catch((err) => {
            console.error("Failed to fetch comments:", err);
          });

        return {
          title: res["title"],
          opening_crawl: res["opening_crawl"],
          release_date: res["release_date"],
          comment_count,
        };
      });

      return res.json({
        data: trimedResults,
      });
    })
    .catch((error) => {
      return res.json({
        error: { message: error.message },
      });
    });
});

module.exports = moviesRouter;
