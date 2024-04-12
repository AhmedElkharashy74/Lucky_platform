const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Course = require('../models/Courses')
const session = require('express-session')
// const teacher = mongoose.model("Teacher", Teacher)

class teacherController{

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
                req.session.userId= user._id;
                req.session.role = 'teacher';
                res.redirect('/Home/');
            } else {
                return res.send('Incorrect password');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server Error');
        }
    }
    
    
    static async create(req,res){
        const newTeacher = new teacher({
            first_name: req.body.fname,
            last_name : req.body.lname,
            email : req.body.email,
            password : req.body.password
        })

        try{
            await newTeacher.save();
            res.status(201).send('record is posted successfully');
        }catch(e){
            console.error(e.message)
        }
    }

        static async read(req, res) {
          try {
            // Retrieve all documents from the "teachers" collection
            const teachers = await Teacher.find();
      
            // Send the retrieved documents as a response
            // res.status(200).json({ success: true, teachers });
            res.render('teacher/home',teachers)
          } catch (error) {
            // Handle any errors that occur during the database query
            console.error(error.message);
            res.status(500).json({ success: false, message: 'An error occurred while fetching teachers' });
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

        static async createCourse(req,res){
            const {title, }
        }
    }

module.exports = teacherController