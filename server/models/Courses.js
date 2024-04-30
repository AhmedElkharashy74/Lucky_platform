const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  description : {
    type : String
  },
  url: {
      type: String,
      required: true
  },
  describtion: String
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
  thumbNail : {
    type : String, 
  },
  videos: [videoSchema] // Array of videos associated with the course

  // You can add more fields like course duration, syllabus, etc.
});

const Course = mongoose.model('Course', courseSchema);
const Video = mongoose.model('Video', videoSchema);


module.exports = {Course,Video};
