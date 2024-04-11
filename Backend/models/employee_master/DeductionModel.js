const mongoose = require('mongoose');

const deductionSchema = new mongoose.Schema({
    deduction: { type: String, required: true }
});

module.exports = mongoose.model('Deduction', deductionSchema);
