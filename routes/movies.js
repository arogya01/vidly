const auth = require("../middleware/auth");
const express = require('express');
const router = express.Router();
const { Movie, validateMovie} = require('../models/movies');
const { Genre } = require('../models/genres');


router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name'); //obtain the values from the database 
    res.send(movies); // send the values to the client side
});

router.post('/',auth, async (req, res) => {

    try{
        const { error } = validateMovie(req.body);
        if (error) return res.status(400).send(error.details[0].message);
   
       const genre = await Genre.findById(req.body.genreId);
       if (!genre) return res.status(400).send('Invalid genre.');
   
       let movie = new Movie({
           title: req.body.title,
           genre: {
               _id: genre._id,
               name: genre.name
           },
           numberInStock: req.body.numberInStock,
           dailyRentalRate: req.body.dailyRentalRate
       }
       );
   
   
       movie = await movie.save();
       res.send(movie);

    }
    catch(err){
        console.log(err);
    }
});


router.put('/:id', async (req, res) => {

    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    let movie = await Movie.findOneAndUpdate(req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        { new: true }
    );
    if (!movie) return res.status(400).send("movie not found...");
    
    res.send(movie);
});


router.delete('/:id', async (req, res) => {
   
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if(!movie) return res.status(400).send('movie entry not found');
});

router.get('/:id', async (req, res) => {
  
    const movie = await Movie.findById(req.params.id);

    if(!movie) return res.status(400).send('movie entry not found');
});

module.exports = router;