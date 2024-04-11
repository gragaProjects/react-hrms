const mongoose = require('mongoose');

const allowanceSchema = new mongoose.Schema({
    allowance: { type: String, required: true },
    overtime_status: { type: String, required: true }
});

module.exports = mongoose.model('Allowance', allowanceSchema);
