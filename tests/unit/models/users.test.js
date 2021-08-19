const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken()", () => {
  it("should return a valid json token", () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
    //   isAdmin: true
    };

    const user = new User();
    const token = user.generateAuthToken(payload);
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
