const mongoose = require("mongoose");


module.exports = function(){

    mongoose.connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to mongodb"));
//   .catch((err) => console.error("could not conect to mongodb", err));
    
}