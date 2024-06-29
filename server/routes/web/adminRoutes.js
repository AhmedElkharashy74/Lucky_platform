const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');


const StudentController = require('../../controllers/studentController');
const CourseController = require('../../controllers/coursesController');
const VideoController = require('../../controllers/videoController');
const TeacherController = require('../../controllers/teacherController');






module.exports = router;