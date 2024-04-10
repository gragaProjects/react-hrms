const mongoose = require('mongoose');

const timeZoneSchema = new mongoose.Schema({
    timezone: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('TimeZone', timeZoneSchema);
