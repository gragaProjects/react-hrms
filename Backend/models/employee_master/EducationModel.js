const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    educationTitle: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Education', educationSchema);
