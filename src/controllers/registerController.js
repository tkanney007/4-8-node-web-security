const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";

const registerUser = async (req, res) => {
  try {
    let hashPass;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("This is the hashed password: ", hash);
      const newUser = {
        email: req.body.email,
        password: hash,
      };
      //user.push(newUser);
      await userModel.create(newUser);

      const result = await userModel.findOne({
        where: { email: newUser.email },
        attributes: ["email"],
      });
      if (result != null) {
        let token = jwt.sign(req.body.email, secretKey);
        res.json({
          result,
          token,
        });
        return;
      }
    });
  } catch (error) {
    res.send(error).status(500);
  }
};

module.exports = { registerUser };
