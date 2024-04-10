const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    organisationName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    businessDomain: { type: String, required: true },
    website: { type: String, required: true },
    startedOn: { type: Date, required: true },
    fax: String,
    poBox: String,
    primaryNo: { type: String, required: true },
    secondaryNo: String,
    currency: String,
    symbol: String,
    address: String,
    country: String,
    state: String,
    district: String,
    city: String,
    zipCode: String,
    logo: String
});

module.exports = mongoose.model('Organisation', organisationSchema);
