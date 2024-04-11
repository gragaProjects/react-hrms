const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    prefixTitle: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Prefix', prefixSchema);
