const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const generateToken = require("../../middlewares/token").generateToken;
const pgp = require("../../dbInit/dbConn").pgp;

// For admin login
router.post("/", async (req, res, next) => {
  try {
    var result = await pgp.query(
      "SELECT * FROM admins WHERE email = ${email}",
      { email: req.body.email }
    );
    if (result.length == 0) {
      throw {
        statusCode: 404,
        customMessage: "User does not exist",
      };
    } else if (!bcrypt.compareSync(req.body.password, result[0].password)) {
      throw {
        statusCode: 401,
        customMessage: "Invalid credentials",
      };
    }
    const token = generateToken(
      {
        username: req.body.email,
        role: "admin",
      },
      3600
    );
    res.status(200).json({
      status: 200,
      message: "Logged in succcessfully",
      data: `Bearer ${token}`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//admin login ends here we dont need this code as of now.

router.post("/login", async (req, res, next) => {
  try {
    var result = await pgp.query(
      "SELECT * FROM users WHERE email = ${email} OR username = ${email}",
      { email: req.body.email }
    );

    if (result.length == 0) {
      throw {
        statusCode: 404,
        customMessage: "User does not exist",
      };
    } else if (!bcrypt.compareSync(req.body.password, result[0].password)) {
      throw {
        statusCode: 401,
        customMessage: "Invalid credentials",
      };
    }
    const token = generateToken(
      {
        useremail: req.body.email,
        username: result[0].username,
      },
      3600
    );
    res.status(200).json({
      message: "Logged in Successfully",
      data: `Bearer ${token}`,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var result = await pgp.query("select * from users where email = ${email}", {
      email: req.body.email,
    });
    if (result.length !== 0) {
      throw {
        statusCode: 404,
        customMessage: "User with the same email already exists",
      };
    }
    result = await pgp.query(
      "INSERT INTO users (fname, lname, email, phone, username, password) VALUES (${fname},${lname},${email},${phone},${username},${hash}) returning email",
      {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        hash: hash,
      }
    );
    res.status(200).json({
      message: "Registered Successfully",
      data: result[0].email,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/generateUsername", async (req, res, next) => {
  try {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    endValue1 = getRandomNumber(firstName.length);
    endValue2 = getRandomNumber(lastName.length);
    if (endValue1 == 0) {
      endValue1 = 1;
    }
    if (endValue2 == 0) {
      endValue2 = 1;
    }
    var getUsername = firstName
      .slice(0, endValue1)
      .concat(lastName.slice(0, endValue2));

    getUsername = getUsername.concat(Math.floor(1000 + Math.random() * 9000));

    while (true) {
      var result = await pgp.query(
        "select * from users where username = ${username}",
        {
          username: getUsername,
        }
      );
      if (result.length === 0) {
        break;
      }

      getUsername = getUsername
        .slice(0, -4)
        .concat(parseInt(getUsername.slice(-4)) + 1);
    }
    res.status(200).json({
      status: 200,
      message: "Generated Unique Username",
      data: getUsername,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
