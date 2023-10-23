const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";

const loginUser = async (req, res) => {
  try {
    let token = jwt.verify(req.body.token, secretKey, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Token could not be verified" });
        return;
      }
    });
    const emailResult = await userModel.findOne({
      where: { email: req.body.email },
      attributes: ["email", "password"],
    });
    if (!emailResult) {
      res.status(400).json({ message: "Email address not found." });
      return;
    }
    if (!bcrypt.compare(req.body.password, emailResult.password)) {
      res.status(400).json({ message: "Password incorrect." });
      return;
    }

    res.status(200).json({
      message: "You have successfully logged in.",
      email: emailResult.email,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while trying to log you in. Please try again.",
    });
  }
};

module.exports = { loginUser };
