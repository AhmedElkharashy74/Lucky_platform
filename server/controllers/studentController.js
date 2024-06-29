const mongoose = require('mongoose');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');

class StudentController {

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await Student.findOne({ email: email });

            if (!user) {
                return res.send('Incorrect email');
            }

            // Compare passwords securely
            if (password === user.password) {
                // Set session ID as user ID and session role as "student"
                req.session.userId= user._id;
                req.session.role = 'student';
                res.redirect('/Home/');
                console.log(req.session.userId);
            } else {
                return res.send('Incorrect password');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server Error');
        }
    }

    async getAllStudents(req, res, next) {
        try {
            const students = await Student.find();
            req.students = students; // Store the fetched data in the request object
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    renderAllStudents(req, res) {
        res.render('students', { students: req.students });
    }

    async getStudentById(req, res, next) {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) return res.status(404).json({ message: 'Cannot find student' });
            req.student = student; // Store the fetched data in the request object
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    renderStudent(req, res) {
        res.render('student', { student: req.student });
    }

    async createStudent(req, res) {
        const { firstName, lastName, email, password } = req.body;
        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const student = new Student({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });

            const newStudent = await student.save();
            res.status(201).json(newStudent);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateStudent(req, res) {
        const { firstName, lastName, email, password } = req.body;
        
        try {
            const student = await Student.findById(req.params.id);
            if (!student) return res.status(404).json({ message: 'Cannot find student' });

            if (firstName != null) student.firstName = firstName;
            if (lastName != null) student.lastName = lastName;
            if (email != null) student.email = email;
            if (password != null) student.password = await bcrypt.hash(password, 10);

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteStudent(req, res) {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) return res.status(404).json({ message: 'Cannot find student' });

            await student.remove();
            res.json({ message: 'Deleted Student' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async logOut(req,res){
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Server Error');
            }
            // Redirect to the login page or send a success response
            res.redirect('login');
        });
    }

    static async profile(req, res) {
        try {
            console.log(req.session.userId);
            const student = await Student.findById(req.session.userId);
            console.log(student);
            res.render('student/xtreme-html/ltr/pages-profile', { student });
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = StudentController;
