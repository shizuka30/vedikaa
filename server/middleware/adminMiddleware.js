// server/middleware/adminMiddleware.js

exports.admin = (req, res, next) => {
    // This middleware should run AFTER the 'protect' middleware.
    // 'protect' will have already attached the user object to the request.
    
    if (req.user && req.user.role === 'admin') {
        next(); // The user is an admin, so proceed to the controller.
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};