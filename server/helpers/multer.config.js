const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinaryUpload } = require('./cloudinary');

const removeExtension = (filename) => {
  return filename.split('.').slice(0, -1).join('.');
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (_req, file) => removeExtension(file.originalname),
    folder: 'your-folder-name', // Replace with your desired folder name in Cloudinary
  },
});

const multerUpload = multer({ storage });

module.exports = {
  multerUpload,
};