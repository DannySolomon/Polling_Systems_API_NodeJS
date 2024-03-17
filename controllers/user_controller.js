const User = require("../models/Users");
const Token = require("../models/Tokens");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

module.exports.userSignUp = (req, res) => {
  const { email, password1, password2 } = req.body;
  let errors = [];

  //check required fileds
  if (!email || !password1 || !password2) {
    errors.push({ error: "Please fill in all the fields" });
  }

  //check password match
  if (password1 !== password2) {
    errors.push({ error: "Passwords do not match" });
  }

  //check password length
  if (password1.length < 6) {
    errors.push({ error: "Password should be atleast 6 chars long" });
  }

  if (errors.length > 0) {
    // res.render("signup", {
    //   email, //sending email, so that even if error is thrown these fields are still filled
    //   errors,
    // });
    return res.json({ errors });
  } else {
    //Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ error: "Email already registered!" });
        // res.render("signup", {
        //   errors,
        // });
        return res.json({ errors });
      } else {
        // creates an instance of the UserSchema but does not save it to the MongoDB
        const newUser = new User({
          email,
          password: password1,
        });

        // encrypting password
        //const salt = await bcrypt.genSalt(10);
        //hasing using bcrypt
        bcrypt.hash(newUser.password, 10, function (err, hash) {
          // Store hash in your password DB.
          //if (err) throw err;
          if (err) {
            return res
              .status(500)
              .json({ error: "Error in hasing password", message: err });
          }

          //set password to hash
          newUser.password = hash;

          //saving user to mongodb atlas
          newUser
            .save()
            .then((user) => {
              return res.status(200).json({
                message: "Successfully created account, please login",
              });
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "Error in saving to db", message: err });
            });
        });
      }
    });
  }
};

module.exports.userLogin = (req, res) => {
  const { email, password } = req.body;

  //authenticate User
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then((result) => {
          if (result) {
            try {
              const access_token = jwt.sign(
                { email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "15m",
                }
              );
              const refresh_token = jwt.sign(
                { email: user.email },
                process.env.REFRESH_TOKEN_SECRET
              );

              newToken = new Token({ user, access_token, refresh_token });

              newToken
                .save()
                .then(() => {
                  return res.json({ access_token, refresh_token });
                })
                .catch((err) => {
                  return res.status(500).json({
                    error: "Error in saving tokens to db",
                    message: err,
                  });
                });
            } catch (err) {
              return res
                .status(500)
                .json({ error: "Error in token validation", message: err });
            }
          } else {
            return res.status(403).json({ error: "Invalid Token sent" });
          }
        });
      } else {
        return res.status(403).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Error in finding the user in db", message: err });
    });
};

module.exports.authenticateToken = (req, res, next) => {
  //Bearer Token
  const authHeader = req.headers["authorization"];

  //spliting the bearer header and token
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not sent" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(403)
        .json({ error: "Invalid token sent", message: err });
    }
    next();
  });
};

module.exports.refreshToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not sent" });
  }

  let decodedToken = {};
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ error: "Invalid token sent", message: err });
  }

  let user_tokens = await Token.findOne({ refresh_token: token });
  if (!user_tokens) {
    return res
      .status(403)
      .json({ error: "Expired old token sent", message: err });
  }

  try {
    const access_token = jwt.sign(
      { email: decodedToken.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refresh_token = jwt.sign(
      { email: decodedToken.email },
      process.env.REFRESH_TOKEN_SECRET
    );

    user_tokens.access_token = access_token;
    user_tokens.refresh_token = refresh_token;
    await user_tokens.save();

    return res.json({ access_token, refresh_token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error in saving tokens to db", message: err });
  }
};
