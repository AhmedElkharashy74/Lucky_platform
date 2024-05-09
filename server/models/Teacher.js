const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  biography : {
    type : String
  }
  ,
  profilePic : {
    type : String,
    unique : true,
    required : true,
    default : ''
  }
  ,
  // You can add more fields like teacher's profile picture, bio, etc.
},{
  timestamps:true
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
