const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const {Course, Video} = require('../models/Courses')
const category = require('../models/cat')
const session = require('express-session')
const {ObjectId} = require("mongodb")
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
                console.log(req.session.userId)
            } else {
                return res.send('Incorrect password');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server Error');
        }
    }
    
    
    static async create(req,res){
        const newTeacher = new Teacher({
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
            const categories = await category.find({});
            const courses = await Course.find({ instructor: new ObjectId(req.session.userId)})
                .populate('category',"name")
                .populate('instructor',"first_name last_name");
            const teacher = await Teacher.findById(req.session.userId);
            res.render('teacher/xtreme-html/ltr/index', { courses, teacher,categories });
        } catch (error) {
            console.error(error); // Log the actual error for debugging
            res.status(500).json({ success: false, message: 'An error occurred while fetching data' });
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
            const {title, description, category, price, instructor} = req.body
            const newCourse = new Course({
                title : title,
                description : description,
                category : category,
                price : price,
                instructor : instructor
            });
            try{
                await newCourse.save();
                res.status(201).redirect(req.header('Referer'));
            }catch(e){
                console.error(e.message);
            }
        }


// Controller function to add a video to an existing course
        static async addVideo(req, res){
    const {id} = req.params; // Get the course ID from the request params
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

// Controller function to read courses by instructor ID
    static async readCourses(req, res) {
    const { id } = req.params;

    try {
        // Find courses by instructor ID
        const courses = await Course.find({ instructor: id });

        // Send the courses as a response
        res.send(courses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}
    static async deleteCourse(req,res){
        try{
            await Course.findByIdAndDelete(req.params.id)
            res.status(200).redirect(req.header('Referer'));
        }catch(e){
            console.error(e)
            res.status(500).send('err');
        }
    }
}



module.exports = teacherController