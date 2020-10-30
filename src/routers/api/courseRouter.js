const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const multer = require("multer");
const sharp = require("sharp");
const Course = require("../models/Course");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

/**
 * Users should be able to view details of all the courses
 * Users should be able to view the content of courses they are enrolled in
 * Admin should be able to create a course (for now only 2 admins i.e. papa & me)
 */

// Everything should be accessible to the admin

// Route   GET api/courses
// @desc   Get all courses
// @access Public
// @tested yes
router.get("/", async (req, res) => {
  try {
    let courses = await Course.find();
    courses = courses
      .filter((x) => x.completed === true)
      .map((c) => {
        const { curriculum, price, category, name, description, id } = c;
        return { curriculum, price, category, name, description, id };
      });
    res.json({ courses });
  } catch (e) {
    console.log(e);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// Route   GET api/courses/:id
// @desc   Get the details of a particular course
// @access Admin
// @tested yes
router.get("/:id", [auth, authAdmin], async (req, res) => {
  try {
    var ObjectId = mongoose.Types.ObjectId;
    var courseId = new ObjectId(req.params.id);
    await Course.findById(courseId)
      .populate("creator")
      .exec(function (err, course) {
        if (err) {
          res.status(500).send({ errors: [{ msg: "Server Error" }] });
        } else {
          if (!course) {
            res.status(404).send({ errors: [{ msg: "No course found" }] });
          } else {
            const {
              name,
              description,
              creator,
              cover,
              price,
              category,
              curriculum,
              completed,
            } = course;

            res.json({
              course: {
                name,
                description,
                creator,
                cover,
                price,
                category,
                curriculum,
                completed,
              },
            });
          }
        }
      });
  } catch (e) {
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// Route   POST api/courses
// @desc   Create a course
// @access Private (only Admin)
// @tested yes
router.post(
  "/",
  [auth, authAdmin],
  [
    // add custom validations in middleware
    check("name", "Name is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("price", "Price must be a number").isInt(),
    check("category", "category is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const creater = req.user._id;

      const { name, category, price, description, cover, lessons } = req.body;
      const course = await new Course({
        name,
        category,
        price,
        description,
        cover,
        lessons,
        creater,
      });

      await course.save();

      // ! Should I return the course as well?
      // * yes
      res.json({ msg: "Course added successfully", course });
    } catch (e) {
      console.log(e);
      res.status(500).send({ errors: [{ msg: "Server Error" }] });
    }
  }
);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

// @route   POST api/courses/:id/avatar
// @desc    Add cover to the course
// @access  Only Admin
router.post(
  "/:id/avatar",
  auth,
  authAdmin,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 250,
          height: 250,
        })
        .png()
        .toBuffer();

      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).send({ errors: [{ msg: "Course not found!" }] });
      }

      if (!course.creator.equals(req.user.id)) {
        return res.status(401).send({ errors: [{ msg: "Unauthorised" }] });
      }

      // ? here can't time be saved?
      await Course.findByIdAndUpdate(
        req.params.id,
        {
          avatar: buffer,
        },
        { useFindAndModify: false } // for removing deprication warning
      );
      res.send({ msg: "Cover updated successfully!!" });
    } catch (e) {
      res.status(500).send({ errors: [{ msg: "Server Error" }] });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ errors: [{ msg: error.message }] });
  }
);

// Route   DELETE api/courses/:id
// @desc   Delete a particular course
// @access Private (only Admin)
router.delete("/:id", [auth, authAdmin], async (req, res) => {
  try {
    // if (window.confirm("Are you ure? This is an irreversible task.")) {
    await Course.deleteOne({ _id: req.params.id });
    res.json({ msg: "Course has been deleted" });
    // }
    // res.json({ msg: "Deletion canceled" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// Get the details of a particular course ( but now you are logged in )
// this will be handled in the userRouter

// Route   PATCH api/courses/:id
// @desc   Update a course
// @access Private (only Admin)
// @tested yes
router.patch("/:id", [auth, authAdmin], async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "course not found!" });
    }
    if (!course.creater.equals(req.user.id)) {
      return res.status(401).json({ msg: "Access Denied!" });
    }
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { useFindAndModify: false }
    );
    res.json({ msg: "Course updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

module.exports = router;
// Filtering done at the client side

// // @route   GET api/courses/:id/avatar
// // @desc    View a profile photo/ avatar
// // @access  Public
// router.get("/:id/avatar", async (req, res) => {
//   try {
//     const course = await course.findById(req.params.id);
//     if (!course || !course.avatar) {
//       throw new Error();
//     }
//     res.set("Content-Type", "image/png");
//     res.send(course.avatar);
//   } catch (e) {
//     res.status(404).send();
//   }
// });

// // Route   DELETE api/courses/:id
// // @desc   Delete a particular course
// // @access Private (only Admin)
// router.delete("/:id", [auth, authAdmin], async (req, res) => {
//   try {
//     const courses = await course.deleteOne({ _id: req.params.id });
//     res.json({ msg: "course deleted successfully!" });
//   } catch (e) {
//     res.status(500).send({ errors: [{ msg: "Server Error" }] });
//   }
// });
