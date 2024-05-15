const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
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
    type : String,
    required: false
  }
  ,
  profilePic : {
    type : String,
    unique : true,
    required : true,
    default : '/public/uploads/pfp/default.jpeg'
  },
  phone: String
  ,
  // You can add more fields like teacher's profile picture, bio, etc.
},{
  timestamps:true
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
