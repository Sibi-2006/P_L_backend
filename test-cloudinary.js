require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log("Checking CLOUDINARY_URL...");
if (!process.env.CLOUDINARY_URL) {
  console.error("❌ ERROR: CLOUDINARY_URL is missing from .env file!");
  process.exit(1);
}

cloudinary.config({ secure: true });

// Upload a 1x1 transparent PNG buffer to verify Cloudinary connection
const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

console.log("Attempting test upload to Cloudinary...");
cloudinary.uploader.upload(sampleBase64, { folder: "pnl_test_uploads" })
  .then(result => {
    console.log("✅ CLOUDINARY SUCCESS!");
    console.log("Uploaded Image URL:", result.secure_url);
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ CLOUDINARY FAILURE:", error.message);
    console.error(error);
    process.exit(1);
  });
