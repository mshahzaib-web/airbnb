// utils/geocoder.js
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "locationiq",
  apiKey: "pk.722ee97e122a7802a345deb2c63b134c", // 🔑 replace with your real key
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
