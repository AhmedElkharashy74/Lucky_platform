const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');


const StudentController = require('../../controllers/studentController');
const CourseController = require('../../controllers/coursesController');
const VideoController = require('../../controllers/videoController');
const TeacherController = require('../../controllers/teacherController');


// // Get all students
// router.get('/', StudentController.getAllStudents,(req,res)=>{
//     res.send('mewo')
// });

// // Get student by ID
// router.get('/:id', StudentController.getStudentById);

// Create a new student
// router.post('/', StudentController.createStudent);

// // Update a student
// router.patch('/:id', StudentController.updateStudent);

// // Delete a student
// router.delete('/:id', StudentController.deleteStudent);



module.exports = router
