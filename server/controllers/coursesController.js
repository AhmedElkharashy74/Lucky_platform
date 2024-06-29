const mongoose = require('mongoose');
const Course = require('../models/Courses').Course;
const Video = require('../models/Courses').Video;
const {format} = require('date-fns');

class CourseController {
  // Get all courses
  static async getAllCourses(req, res) {
    try {
        const courses = await Course.find().populate('category').populate('instructor');
        // Format the date using date-fns
        const formattedCourses = courses.map(course => {
            return {
                ...course._doc,
                createdAtFormatted: format(new Date(course.createdAt), 'yyyy-MM-dd') // Format as desired
            };
        });
        res.render('courses', { courses: formattedCourses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

  // Get one course
  static async getCourseById(req, res) {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor')
            .populate('category')
            .populate('studentsEnrolled')
            .populate('videos');
        
        if (!course) return res.status(404).json({ message: 'Cannot find course' });

        // Format the creation date using date-fns
        const formattedCourse = {
            ...course._doc,
            createdAtFormatted: format(new Date(course.createdAt), 'yyyy-MM-dd'), // Format as desired
            instructor: course.instructor ? course.instructor.name : 'Unknown',
            category: course.category ? course.category.name : 'Unknown',
            studentsEnrolled: course.studentsEnrolled.map(student => student.name),
            videos: course.videos.map(video => ({
                ...video._doc,
                createdAtFormatted: format(new Date(video.createdAt), 'yyyy-MM-dd') // Format as desired
            }))
        };

        res.json(formattedCourse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

  // Create one course
  static async createCourse(req, res) {
    const { title, description, instructor, category, studentsEnrolled, price, thumbNail, courseCode, courseState, videos } = req.body;
    
    const course = new Course({
      title,
      description,
      instructor,
      category,
      studentsEnrolled,
      price,
      thumbNail,
      courseCode,
      courseState,
      videos
    });

    try {
      const newCourse = await course.save();
      res.status(201).json(newCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Update one course
  static async updateCourse(req, res) {
    const { title, description, instructor, category, studentsEnrolled, price, thumbNail, courseCode, courseState, videos } = req.body;
    
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Cannot find course' });

      if (title != null) course.title = title;
      if (description != null) course.description = description;
      if (instructor != null) course.instructor = instructor;
      if (category != null) course.category = category;
      if (studentsEnrolled != null) course.studentsEnrolled = studentsEnrolled;
      if (price != null) course.price = price;
      if (thumbNail != null) course.thumbNail = thumbNail;
      if (courseCode != null) course.courseCode = courseCode;
      if (courseState != null) course.courseState = courseState;
      if (videos != null) course.videos = videos;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete one course
  static async deleteCourse(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Cannot find course' });

      await course.remove();
      res.json({ message: 'Deleted Course' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get courses by teacher ID
  static async getCoursesByTeacherId(req, res) {
    try {
      const courses = await Course.find({ instructor: req.params.teacherId }).populate('instructor').populate('category').populate('studentsEnrolled').populate('videos');
      if (courses.length === 0) return res.status(404).json({ message: 'No courses found for this teacher' });
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get courses by student ID
  static async getCoursesByStudentId(req, res) {
    try {
      const courses = await Course.find({ studentsEnrolled: req.params.studentId }).populate('instructor').populate('category').populate('studentsEnrolled').populate('videos');
      if (courses.length === 0) return res.status(404).json({ message: 'No courses found for this student' });
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getVideosByCourseId(req, res) {
    const { id } = req.params;

    try {
        const course = await Course.findById(id).populate({
            path: 'videos',
            options: {
                sort: { createdAt: -1 } // Sort videos by date in descending order
            }
        });

        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json(course.videos);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}


}

module.exports =  CourseController;
