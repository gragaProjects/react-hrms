const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
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
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    cityName: { type: String, required: true }
});

module.exports = mongoose.model('City', citySchema);
