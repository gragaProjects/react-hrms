const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    designationName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Designation', designationSchema);
