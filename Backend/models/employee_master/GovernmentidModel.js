const mongoose = require('mongoose');

const governmentIDSchema = new mongoose.Schema({
    governmentID: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('GovernmentID', governmentIDSchema);
