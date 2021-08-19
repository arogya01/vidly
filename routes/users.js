const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/users");
const mongoose = require("mongoose");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//when the user is signing up.
router.post("/", async (req, res) => {
  //info entered should be correct.
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check for existing user using email
  let existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).send("User Already Registered");

  //create a new user using lodash
  let user = new User(_.pick(req.body, ["name", "email", "password"]));

 
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
 
 //generating the json token.
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
  //in http header, the first arg is name and second is the token
});

module.exports = router;
