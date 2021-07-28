const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema}= require('./genres');


const Movie = mongoose.model('Movie',new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50
    },
   genre:{
       type:genreSchema,
       required:true
   },
   numberInStock:{
       type:Number,
       required:true,
       min:0,
       max:255
   },
   dailyRentalRate:{
       type:Number,
       required:true,
       min:0,
       max:255
   }
  })
  );


  function validateMovie(movie) {
    const schema = {
     title: Joi.string().min(3).required(),
     genreId: Joi.objectid().required(),
     numberInStock:Joi.number().min(0).required(),
     dailyRentalRate:Joi.number().min(0).required()
    };
  
    return Joi.validate(movie, schema);
  }


  module.exports.Movie = Movie;
  module.exports.validateMovie = validateMovie;