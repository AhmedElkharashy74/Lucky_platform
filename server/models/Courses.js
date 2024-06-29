const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // مدة الفيديو بالثواني
    required: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
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
    default: true // حالة الكورس نشط افتراضيًا
  },
  videos: [videoSchema], // مصفوفة من الفيديوهات المرتبطة بالكورس
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
      required: false
    }
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
const Video = mongoose.model('Video', videoSchema);

module.exports = { Course, Video };
