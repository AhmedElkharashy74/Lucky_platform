const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');


const StudentController = require('../../controllers/studentController');
const CourseController = require('../../controllers/coursesController');
const VideoController = require('../../controllers/videoController');
const TeacherController = require('../../controllers/teacherController');


router.get('/home',auth('teacher'), TeacherController.viewHome)


router.get('/',TeacherController.getAllTeachers);
router.get('/:id', (req, res) => TeacherController.getTeacherById(req, res));
router.post('/', (req, res) => TeacherController.createTeacher(req, res));
router.patch('/:id', (req, res) => TeacherController.updateTeacher(req, res));
router.delete('/:id', (req, res) => TeacherController.deleteTeacher(req, res));




module.exports = router

