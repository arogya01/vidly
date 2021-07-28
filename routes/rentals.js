const auth = require("../middleware/auth");
const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rentals');
const mongoose = require('mongoose');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');
const Fawn = require('fawn');

Fawn.init(mongoose);


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut'); //obtain the values from the database 
    res.send(rentals); // send the values to the client side
});

router.post('/',auth, async (req, res) => {

    try {
        const { error } = validateRental(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid customer.');



        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid movie.');

        if (movie.numberInStock === 0) return res.status(400).send('Movie is Out of Stock');

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie.id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
        }
        );

        try {
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies',
                    { _id: movie._id },
                    { $inc: { numberInStock: -1 } }
                )
                .run();
        }
        catch (ex) {
            res.status(500).send('something failed');
        }

        res.send(rental);

    }
    catch (err) {
        console.log(err);
    }
});


router.put('/:id', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    let rental = await Rental.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            customer: {
                _id: customer._id,
                name: customer.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        { new: true }
    );
    if (!rental) return res.status(400).send("rental not found...");

});


router.delete('/:id', async (req, res) => {

    const rental = await Rental.findByIdAndDelete(req.params.id);

    if (!rental) return res.status(400).send('rental entry not found');
});

router.get('/:id', async (req, res) => {

    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(400).send('rental entry not found');
});



module.exports = router;