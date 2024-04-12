// authMiddleware.js

const authMiddleware = (role) => {
    return (req, res, next) => {
        // Check if the session contains the user ID and role matching the specified role parameter
        if (req.session.userId && req.session.role === role) {
            // User is authenticated, proceed to the next middleware or route handler
            next();
        } else {
            // User is not authenticated or does not have the required role, send an error response
            res.status(401).redirect('/login');
        }
    };
};

module.exports = authMiddleware;
