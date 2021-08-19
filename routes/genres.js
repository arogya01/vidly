const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genres");
const jwt = require("jsonwebtoken");


router.get(
  "/",
  async (req, res) => {
       throw new error('deliberate error');
      const genres = await Genre.find().sort("name"); //obtain the values from the database
      res.send(genres); // send the values to the client side    
  });

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  } catch (err) {
    console.log("error:", err);
  }
});

module.exports = router;
