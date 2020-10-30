const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover: {
    type: Buffer,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  curriculum: {
    link: { type: String },
    syllabus: [
      { chapter: { type: String }, content: [{ lesson: { type: String } }] },
    ],
  }, // this link will be to view a pdf that will stored on cloud
  lessons: [
    {
      lesson: {
        chapter: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        number: {
          type: Number,
        },
        link: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    },
  ],
  creater: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  students: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Course", courseSchema);

// comments: [
//   {
//     comment: {
//       text: {
//         type: "String",
//       },
//       user: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },
//       rating: {
//         type: Number,
//       },
//     },
//   },
// ],
// rating: {
//   type: Number,
//   default: 0,
// },
