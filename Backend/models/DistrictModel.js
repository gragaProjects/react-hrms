const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    districtName: { type: String, required: true }
});

module.exports = mongoose.model('District', districtSchema);
