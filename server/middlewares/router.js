const express = require('express');
const teacherController = require('../controllers/teacherController')
const auth = require('./auth');
const router = express.Router();

router.post('/login',teacherController.login)
router.get('/',(req,res)=>{
    res.render('login');
})

router.get('/', (req, res) => teacherController.getAllTeachers(req, res));
router.get('/:id', (req, res) => teacherController.getTeacherById(req, res));
router.post('/', (req, res) => teacherController.createTeacher(req, res));
router.patch('/:id', (req, res) => teacherController.updateTeacher(req, res));
router.delete('/:id', (req, res) => teacherController.deleteTeacher(req, res));

router.post('/teacher/create-course/', teacherController.createCourse)
router.get('/logout',teacherController.logOut)
router.post('/teacher/add-video/:id',auth('teacher'),teacherController.addVideo);
router.get('/teacher/:id/',teacherController.readCourses)
router.get('/Home/pages-profile.html',auth('teacher'),teacherController.profile)
module.exports = router