const express = require('express');
const teacherController = require('../controllers/teacherController')
const auth = require('./auth');
const router = express.Router();

router.post('/teacher/register',teacherController.create)
router.post('/login',teacherController.login)
router.get('/',(req,res)=>{
    res.render('login');
})
router.get('/Home/',auth('teacher'),teacherController.read)
router.post('/teacher/create-course/', teacherController.createCourse)
router.get('/logout',teacherController.logOut)
router.post('/teacher/add-video/:id',auth('teacher'),teacherController.addVideo);
router.get('/teacher/:id/',teacherController.readCourses)
router.get('/Home/pages-profile.html',auth('teacher'),teacherController.profile)
module.exports = router