const mongoose = require('mongoose');

const nationalitySchema = new mongoose.Schema({
    nationalityName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Nationality', nationalitySchema);
