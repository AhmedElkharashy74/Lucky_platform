const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/uploadVid');



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

router.get('/Add-Video/:courseId',auth('teacher'),TeacherController.viewAddVid);

router.get('/profile/:id', auth('teacher'), TeacherController.viewProfile);

router.post('/Add-Video/:courseId',auth('teacher'),upload.single('video'),VideoController.addVideo);

router.get('/video/:id', auth('teacher'),VideoController.viewVideo)





module.exports = router

