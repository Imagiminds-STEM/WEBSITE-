const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
var path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email",
    pass: "password",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    // add custom validations in middleware
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // Grab errors from validation middleware
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      console.log(req.body);

      // Look if user with this email id already exists
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Generate a token for the user
      const newUser = await new User({ name, email, password });
      const token = await newUser.generateAuthToken();

      // Register user
      await newUser.save();

      //email verification
      var date = new Date();
      var mail = {
        email: email,
        created: date.toString(),
      };

      const token_mail_verification = jwt.sign(email, config.JWT_SECRET, {});

      //var url = config.baseUrl + "verify?email=" + token_mail_verification;

      // send mail with defined transport object
      let info = await transporter.sendMail(
        {
          from: '"Name" <email>', // sender address
          to: email,
          subject: "Welcome to Imagiminds", // Subject line
          text: "Thank you for creating an account with Imagiminds", //+ url,  plain text body
        },
        (error, info) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log("Message sent successfully!");
          console.log(info);
          transporter.close();
        }
      );
      //email verification

      // Send msg to client
      res.status(201).send({ user: newUser, token });
    } catch (e) {
      console.log(e);
      res.status(500).send({ errors: [{ msg: "Unable to Register" }] });
    }
  }
);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    console.log(req.body);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User doesn't exist" }] });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ msg: "User logged in successfully!", user, token });
  } catch (e) {
    res
      .status(500)
      .send({ errors: [{ msg: "Incorrect username/password field" }] });
  }
});

router.post("/forgot", async (req, res) => {
  var e = req.body.email;
  const user = await User.findByEmail(e);
  if (!user) {
    return res.status(404).json({ errors: [{ msg: "User doesn't exist" }] });
  }
  const token = user.generateAuthToken();
  let mailDetails = {
    from: "email",
    to: e,
    subject: "Reset password",
    html:
      '<a href="http://localhost:5000/resetpassword?email=' +
      e +
      "&token=" +
      token +
      '">Reset password</a>',
  };

  transporter.sendMail(mailDetails, (err, data) => {
    if (err) console.log(err);
    else console.log("mail sent");
  });
  // res.send("check your inbox");
  res.redirect("/");
});

router.post("/finalreset", async (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  var e = req.body.email;
  var p = req.body.password;
  const user = await User.findByEmail(req.body.email);
  console.log(user.email + " " + user.password);
  user.password = p;
  await user.save();
  console.log(user.email + " " + user.password);
  res.redirect("/login");

  // res.send("check your inbox");
  res.redirect("/");
});

// @route   GET api/users
// @desc    Get yourself
// @access  Private
router.get("/", auth, (req, res) => {
  res.send(req.user);
});

// @route   POST api/users/enroll/:id
// @desc    Enroll into a course
// @access  Private
// @tested yes
router.post("/enroll/:id", auth, async (req, res) => {
  try {
    const course_Id = req.params.id;
    const user = req.user;
    let courses = user.courses;
    // if successfull transaction or valid +coupon
    courses.push({ course: course_Id });
    await user.save();
    res.send({ msg: "Enrolled into the course successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Server error" });
  }
});

// @route   POST api/users/logout
// @desc    Logout user
// @access  Private
router.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();
    res.json({ msg: "User logged out successfully!" });
  } catch (e) {
    res.status(500).send({ error: e || "Server error" });
  }
});


router.get("/reset-password", (req, res) => {
  res.sendFile("reset.html", { root: "./Imagi1/" });
});

router.get("/resetpassword", async (req, res) => {
  var e = req.query.email;
  var token = req.query.token;
  const user = await User.findByEmail(e);
  var t = user.generateAuthToken();
  if (t == token) {
    res.sendFile("password_reset.html", { root: "./Imagi1/" });
  }
});
module.exports = router;
