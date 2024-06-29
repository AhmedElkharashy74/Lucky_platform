const express = require('express');
const router = express.Router();
const CourseController = require('../../controllers/coursesController')
const videoController = require('../../controllers/videoController');
const teacherController = require('../../controllers/teacherController')
const authMiddleware = require('../../middlewares/auth');

// Route to get all courses
router.get('/', authMiddleware(['teacher', 'admin']), CourseController.getAllCourses);

// Route to get a specific course by ID
router.get('/:id', authMiddleware(['teacher', 'admin', 'student']), teacherController.viewCourse);

// Route to create a new course
router.post('/', authMiddleware(['teacher', 'admin']), teacherController.createCourse);

// Route to update an existing course
router.put('/:id', authMiddleware(['teacher', 'admin']), CourseController.updateCourse);

// Route to delete a course
router.delete('/:id', authMiddleware(['teacher', 'admin']), teacherController.deleteCourse);

// Route to add a video to a course
router.post('/:id/videos', authMiddleware(['teacher', 'admin']), teacherController.addVideo);

// Route to get courses by instructor ID
router.get('/instructor/:id', authMiddleware(['teacher', 'admin']), CourseController.getCoursesByTeacherId);



module.exports = router;
