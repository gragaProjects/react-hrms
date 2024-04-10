const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    stateName: { type: String, required: true }
});

module.exports = mongoose.model('State', stateSchema);
