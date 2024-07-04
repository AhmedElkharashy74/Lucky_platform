const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');
const { Course, Video } = require('../models/Courses');
const session = require('express-session');
const { ObjectId } = require('mongodb');
const Category = require('../models/cat');
const {format} = require('date-fns')

class teacherController {
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await Teacher.findOne({ email: email });

            if (!user) {
                return res.send('Incorrect email');
            }

            // Compare passwords securely
            if (password === user.password) {
                // Set session ID as user ID and session role as "teacher"
                req.session.userId = user._id;
                req.session.role = 'teacher';
                res.redirect('teacher/home/');
                console.log(req.session.userId);
            } else {
                return res.send('Incorrect password');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server Error');
        }
    }

    static async getAllTeachers(req, res) {
        try {
            const teachers = await Teacher.find();
            res.json(teachers);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getTeacherById(req, res) {
        try {
            const teacher = await Teacher.findById(req.params.id);
            if (!teacher) return res.status(404).json({ message: 'Cannot find teacher' });
            res.json(teacher);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async createTeacher(req, res) {
        const { first_name, last_name, email, password, biography, profilePic, phone } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const teacher = new Teacher({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                biography,
                profilePic,
                phone
            });

            const newTeacher = await teacher.save();
            res.status(201).json(newTeacher);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async updateTeacher(req, res) {
        const { first_name, last_name, email, password, biography, profilePic, phone } = req.body;

        try {
            const teacher = await Teacher.findById(req.params.id);
            if (!teacher) return res.status(404).json({ message: 'Cannot find teacher' });

            if (first_name != null) teacher.first_name = first_name;
            if (last_name != null) teacher.last_name = last_name;
            if (email != null) teacher.email = email;
            if (password != null) teacher.password = await bcrypt.hash(password, 10);
            if (biography != null) teacher.biography = biography;
            if (profilePic != null) teacher.profilePic = profilePic;
            if (phone != null) teacher.phone = phone;

            const updatedTeacher = await teacher.save();
            res.json(updatedTeacher);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async deleteTeacher(req, res) {
        try {
            const teacher = await Teacher.findById(req.params.id);
            if (!teacher) return res.status(404).json({ message: 'Cannot find teacher' });

            await teacher.remove();
            res.json({ message: 'Deleted Teacher' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async logOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Server Error');
            }
            // Redirect to the login page or send a success response
            res.redirect('login');
        });
    }

    static async createCourse(req, res) {
        const { title, description, category, price } = req.body;
        const instructor = req.session.userId;
        const newCourse = new Course({
            title: title,
            description: description,
            category: category,
            price: price,
            instructor: instructor
        });
        try {
            await newCourse.save();
            res.status(201).redirect(req.header('Referer'));
        } catch (e) {
            console.error(e.message);
        }
    }

    static async addVideo(req, res) {
        const { id } = req.params; // Get the course ID from the request params
        const { title, url } = req.body; // Get the video data from the request body

        try {
            // Find the course by ID
            const course = await Course.findById(id);

            if (!course) {
                return res.status(404).send('Course not found');
            }

            // Create a new video object using the Video schema
            const newVideo = new Video({ title, url });

            // Save the new video document
            await newVideo.save();

            // Add the new video to the course's videos array
            course.videos.push(newVideo);

            // Save the updated course document
            await course.save();

            res.status(200).send('Video added to course successfully');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    static async deleteCourse(req, res) {
        try {
            await Course.findByIdAndDelete(req.params.id);
            res.status(200).redirect(req.header('Referer'));
        } catch (e) {
            console.error(e);
            res.status(500).send('err');
        }
    }

    static async profile(req, res) {
        try {
            console.log(req.session.userId);
            const courses = await Course.find({ 'instructor': new ObjectId(req.session.userId) });
            const teacher = await Teacher.findById(req.session.userId);
            console.log(teacher);
            res.render('teacher/xtreme-html/ltr/pages-profile', { courses, teacher });
        } catch (e) {
            console.error(e);
        }
    }


     // Get all categories
  static async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get a category by ID
  static async getCategoryById(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Create a new category
  static async createCategory(req, res) {
    const { name, description, image } = req.body;

    const category = new Category({
      name,
      description,
      image
    });

    try {
      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Update an existing category
  static async updateCategory(req, res) {
    const { name, description, image } = req.body;

    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      if (name != null) category.name = name;
      if (description != null) category.description = description;
      if (image != null) category.image = image;

      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete a category
  static async deleteCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      await category.remove();
      res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  static async viewHome(req, res) {
    try {
        const teacherId = req.session.userId;

        // Fetch the teacher data
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        // Fetch the courses taught by the teacher and populate the category field
        const courses = await Course.find({ instructor: teacherId }).populate('category');

        // Format the creation date for each course
        const formattedCourses = courses.map(course => ({
            ...course._doc,
            createdAtFormatted: format(course.createdAt, 'yyyy-MM-dd'), // Adjust the format as needed
        }));

        // Fetch all categories
        const categories = await Category.find();

        // Render the home page with the retrieved data
        res.render('teacher/xtreme-html/ltr/index', {
            teacher: teacher,
            courses: formattedCourses,
            categories: categories
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server Error');
    }
}

static async viewCourse(req, res) {
    try {
        const teacherId = req.session.userId;
        const courseId = req.params.id;

        // Fetch the teacher data
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        // Fetch the course by ID and populate the necessary fields
        const course = await Course.findById(courseId)
            .populate('instructor')
            .populate('category')
            .populate('studentsEnrolled')
            .populate('videos');

        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Render the course page with the retrieved data
        res.render('teacher/xtreme-html/ltr/videos', {
            teacher: teacher,
            course: course,
            videos: course.videos
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server Error');
    }
}




static async viewAddVid(req, res) {
    try {
        const teacherId = req.session.userId;

        // Fetch the teacher data
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        const course_id = req.params.courseId;
        // Render the add video page with the retrieved data
        res.render('teacher/xtreme-html/ltr/create-vid', {
            teacher: teacher,
            id: course_id
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server Error');
    }
}

static async viewProfile(req, res) {
    try {
        const teacherId = req.session.userId; // Assuming you store teacher's userId in session

        // Validate the teacherId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).send('Invalid Teacher ID');
        }

        // Fetch the teacher data
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        // Count courses created by the teacher
        const courses = await Course.find({ instructor: teacherId });
        const courseCount = courses.length;

        // Count videos created by the teacher
        let videoCount = 0;
        for (const course of courses) {
            videoCount += await Video.countDocuments({ course: course._id });
        }

        // Render the profile page with the retrieved data
        res.render('teacher/xtreme-html/ltr/pages-profile', {
            teacher: teacher,
            courseCount: courseCount,
            videoCount: videoCount
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server Error');
    }
}
}


module.exports = teacherController;
