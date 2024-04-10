const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    businessUnit: { type: String, required: true }, // Assuming businessUnit is a string field
    departmentName: { type: String, required: true },
    departmentCode: { type: String, required: true },
    departmentHead: { type: String, required: true }, // Assuming departmentHead is a string field
    startedOn: { type: Date, required: true },
    description: String,
    status: { type: String, required: true  } //enum: ['Active', 'Inactive'], default: 'Active'  // Assuming status is either 'Active' or 'Inactive'
});

module.exports = mongoose.model('Department', departmentSchema);