const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { getTrades, createTrade, updateTrade, clearTrades, deleteTrade } = require('../controllers/tradeController');

router.use(auth);

// Handle multer errors specifically
const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error("Upload Error Middleware:", err);
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.get('/', getTrades);
router.post('/', upload.single('image'), handleUploadError, createTrade);
router.put('/:id', updateTrade);
router.delete('/clear', clearTrades);
router.delete('/:id', deleteTrade);

module.exports = router;
