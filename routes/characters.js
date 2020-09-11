const express = require("express");
const axios = require("axios");
const charactersRouter = express.Router();

// methods
function formatHeight(num) {
  return num / 30.48;
}

charactersRouter.route("/").get((req, res) => {
  // make request to the api
  axios
    .get("https://swapi.dev/api/people/")
    .then((response) => {
      let { results } = response.data;
      let total_height = 0;
      let count = results.length;

      results.forEach((character) => {
        total_height += Number(character.height);
      });

      let trimedResults = results.map(function (res) {
        return {
          name: res["name"],
          height: res["height"],
          gender: res["gender"],
        };
      });

      // sort by name
      if ((sort = req.query.name)) {
        trimedResults.sort((character1, character2) => {
          // ignore upper or lower case
          let name1 = character1.name.toUpperCase();
          let name2 = character2.name.toUpperCase();

          // 'asce' for the order a-z and 'desc' for the other way round
          if (sort === "asce") return name1 > name2;
          if (sort === "desc") return name1 < name2;
        });
      }

      // sort by character's height
      if ((sort = req.query.height)) {
        trimedResults.sort((character1, character2) => {
          let h1 = character1.height;
          let h2 = character2.height;

          if (sort === "asce") return h1 - h2;
          if (sort === "desc") return h2 - h1;

          return res.json({
            errors:
              "height parameter has to have a value of either 'asce' or 'desc'",
          });
        });
      }

      // filter by character's gender
      if ((sort = req.query.gender)) {
        let filteredResultsTotalHeight = 0;
        let filteredResults = trimedResults.filter((character) => {
          if (sort === "male") return (character.gender = "male");
          if (sort === "female") return (character.gender = "female");
          if (sort === "robot")
            return character.gender != "male" && character.gender != "female";
        });

        filteredResults.forEach((character) => {
          filteredResultsTotalHeight += Number(character.height);
        });

        if (filteredResults.length == 0) {
          return res.json({
            errors: {
              message:
                "The value passed for height parameter is unkown. Try 'male', 'female' and 'robot'",
            },
          });
        }

        return res.json({
          data: filteredResults,
          meta: {
            count: filteredResults.length,
            total_height: {
              centimeters: filteredResultsTotalHeight,
              feet: formatHeight(filteredResultsTotalHeight),
            },
          },
        });
      }

      return res.json({
        data: trimedResults,
        meta: {
          count,
          total_height: {
            centimeter: total_height,
            feet: formatHeight(total_height),
          },
        },
      });
    })
    .catch((error) => {
      return res.json({
        errors: { message: error.message },
      });
    });
});

charactersRouter.route("/:name").get((req, res) => {
  axios
    .get("https://swapi.dev/api/people/", {
      params: {
        search: req.params.name,
      },
    })
    .then((response) => {
      let { results } = response.data;
      let total_height = 0;
      let count = results.length;

      let trimedResults = results.map(function (res) {
        return {
          name: res["name"],
          height: res["height"],
          gender: res["gender"],
        };
      });

      results.forEach((character) => {
        total_height += Number(character.height);
      });

      return res.json({
        data: trimedResults,
        meta: {
          count,
          total_height: {
            centimeters: total_height,
            feet: formatHeight(total_height),
          },
        },
      });
    })
    .catch((error) => {
      return res.json({
        errors: { message: error.message },
      });
    });
});

module.exports = charactersRouter;
