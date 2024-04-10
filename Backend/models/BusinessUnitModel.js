const mongoose = require('mongoose');

const businessUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  startedOn: {
    type: Date,
    required: true
  },
  timeZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeZone',
    required: true
  },
  // timeZone: {
  //   type: String,
  //   required: true
  // },
  // country: {
  //   type: String,
  //   required: true
  // },
  // state: {
  //   type: String,
  //   required: true
  // },
  // district: {
  //   type: String,
  //   required: true
  // },
  // city: {
  //   type: String,
  //   required: true
  // },
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
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  description: String,
  address: String,
  leaveStructure: String,
  holidayStructure: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

const BusinessUnit = mongoose.model('BusinessUnit', businessUnitSchema);

module.exports = BusinessUnit;
