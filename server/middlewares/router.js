const express = require('express');
const teacherController = require('../controllers/teacherController')
const auth = require('./auth');
const router = express.Router();

router.get('/',teacherController.read)
router.post('/teacher/register',teacherController.create)
router.post('/login',teacherController.login)
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/Home/',auth('teacher'),teacherController.read)
router.get('/logout',teacherController.logOut)
module.exports = router