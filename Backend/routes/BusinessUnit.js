// const router = require("express").Router()
// const { User,OrganisationModel } = require("../models")
const express = require('express');
const router = express.Router();
const { BusinessUnit } = require("../models")


// Add a new business unit
// router.post('/add', async (req, res) => {
//   try {
//     const newBusinessUnit = new BusinessUnit(req.body); // Assuming BusinessUnit is your Mongoose model
//     await newBusinessUnit.save();
//     res.status(201).json(newBusinessUnit);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post('/add', async (req, res) => {
  try {
    // Check if a business unit with the same name already exists
    const existingBusinessUnit = await BusinessUnit.findOne({ name: req.body.name });
    if (existingBusinessUnit) {
      return res.status(400).json({ message: 'Business unit with this name already exists' });
    }

    // If no duplicate found, create and save the new business unit
    const newBusinessUnit = new BusinessUnit(req.body);
    await newBusinessUnit.save();

    const populated = await BusinessUnit.findById(newBusinessUnit._id)
    .populate('country', 'countryName')
    .populate('state', 'stateName')
    .populate('district', 'districtName')
    .populate('city', 'cityName')
    .populate('timeZone', 'timezone');
    ;

    res.status(201).json(populated);
  //  res.status(201).json(newBusinessUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update an existing business unit by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBusinessUnit = await BusinessUnit.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBusinessUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a business unit by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await BusinessUnit.findByIdAndDelete(id);
    res.status(200).json({ message: 'Business unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a business unit by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const businessUnit = await BusinessUnit.findById(id);
    if (!businessUnit) {
      return res.status(404).json({ message: 'Business unit not found' });
    }
    res.json(businessUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all business units
router.get('/get', async (req, res) => {
  try {
    const businessUnits = await BusinessUnit.find().populate('country', 'countryName').populate('district', 'districtName').populate('state', 'stateName').populate('city', 'cityName').populate('timeZone', 'timezone');
    res.json(businessUnits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
