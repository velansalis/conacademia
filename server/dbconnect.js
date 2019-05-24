const mongoose = require("mongoose");

module.exports = function(req, res, next) {
  mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(res => {
      console.log(
        `Database Successfully Connected - [${process.env.MONGO_URL}]`
      );
    })
    .catch(err => {
      console.log("There was an error connecting database.");
    });
};
