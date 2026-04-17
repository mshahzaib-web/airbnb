
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: "dilufauwr",
  api_key: "619425652329814",
  api_secret: "_SGeVTQkUiZnhp4Z6JGs5LQNtgs",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'WonderList_DEV',
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});
module.exports = {cloudinary, storage};