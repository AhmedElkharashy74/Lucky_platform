const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  url: {
    type: String,
    required: true,
  },
  duration: String,
  publishDate: {
    type: Date,
    default: Date.now
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  price: {
    type: Number,
    required: true
  },
  thumbNail: {
    type: String
  },
  courseCode: {
    type: String
  },
  courseState: {
    type: Boolean,
    default: true 
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }], 
  ratings: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
    }
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
const Video = mongoose.model('Video', videoSchema);

module.exports = { Course, Video };
