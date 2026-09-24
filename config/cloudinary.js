const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary SDK automatically parses CLOUDINARY_URL from process.env
cloudinary.config({
  secure: true
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pnl_trade_screenshots',
    // Allow all common image formats
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg', 'bmp', 'tiff', 'heic'],
    transformation: [{ width: 1200, crop: 'limit' }] // Optimize image size
  }
});

// File filter fallback to validate file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (.png, .jpg, .jpeg, .webp, .gif, etc.) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = { cloudinary, upload };
