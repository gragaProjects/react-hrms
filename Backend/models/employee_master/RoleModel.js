const mongoose = require('mongoose');

const roleNameSchema = new mongoose.Schema({
    roleName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('RoleName', roleNameSchema);
