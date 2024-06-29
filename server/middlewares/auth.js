const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const authMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            // Check if the session contains the user ID and role
            if (req.session.userId && roles.includes(req.session.role)) {
                // Ensure the user ID is valid
                let user;
                if (req.session.role === 'teacher') {
                    user = await Teacher.findById(req.session.userId);
                } else if (req.session.role === 'student') {
                    user = await Student.findById(req.session.userId);
                }

                if (!user) {
                    req.session.destroy();
                    return res.status(401).send('Unauthorized: Invalid session');
                }

                // Log the successful authentication
                console.log(`Authenticated user: ${req.session.userId} with role: ${req.session.role}`);

                // User is authenticated and has one of the required roles, proceed to the next middleware or route handler
                return next();
            } else {
                // User is not authenticated or does not have any of the required roles
                console.warn(`Unauthorized access attempt by user ID: ${req.session.userId}, role: ${req.session.role}`);
                return res.status(401).send('Unauthorized');
            }
        } catch (err) {
            console.error('Authentication middleware error:', err);
            return res.status(500).send('Internal Server Error');
        }
    };
};

module.exports = authMiddleware;
