const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    educationLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Education',
        required: true
    },
    courseName: { type: String, required: true }
});

module.exports = mongoose.model('Course', courseSchema);
