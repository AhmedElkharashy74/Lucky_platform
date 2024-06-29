const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
// const router = require('./server/middlewares/router')
const session = require('express-session')
const adminRouter = require('./server/routes/web/adminRoutes')
const studentRouter = require('./server/routes/web/studentRoutes')
const teacherRouter = require('./server/routes/web/teacherRoutes')
const categoryRouter = require('./server/routes/web/categoryRoutes')
const courseRouter = require('./server/routes/web/courseRoutes')
const teacherController = require('./server/controllers/teacherController')
const studentController = require('./server/controllers/studentController')
const courseController = require('./server/controllers/coursesController')




// Initialize Express app
const app = express();

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Set up EJS as the view engine
// app.use('/static', express.static(path.join(__dirname, 'views')))

app.use(express.static('views/teacher'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
  secret: 'your_secret_key', // Change this to a secure secret key
  resave: false,
  saveUninitialized: false
}));
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/lucky');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);
app.use('/student',studentRouter);
app.use('/category',categoryRouter);
app.use('/courses', courseRouter)
// Define your routes here

app.get('/', (req,res)=>{
  res.render("login");
})
app.post('/login', teacherController.login);


function getMethodNames(className) {
  // Get instance methods
  let instanceMethods = Object.getOwnPropertyNames(className.prototype).filter(method => method !== 'constructor');

  // Get static methods
  let staticMethods = Object.getOwnPropertyNames(className).filter(method => typeof className[method] === 'function' && method !== 'length' && method !== 'prototype' && method !== 'name');

  return { instanceMethods, staticMethods };
}

console.log(getMethodNames(courseController));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
