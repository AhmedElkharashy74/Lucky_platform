// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/vids/')); // Directory to save files
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Format: fieldname-timestamp.ext
    }
});

// Configure file upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // Limit file size to 1GB
    fileFilter: function (req, file, cb) {
        const fileTypes = /mp4|mkv|avi/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only videos in mp4, mkv, and avi formats are allowed'));
        }
    }
});

module.exports = upload;
