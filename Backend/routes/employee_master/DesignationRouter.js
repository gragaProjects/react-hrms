const express = require('express');
const router = express.Router();
const { Designation } = require("../../models");

// Add a new designation
router.post('/add', async (req, res) => {
  try {
    // Check if a designation with the same name already exists
    const existingDesignation = await Designation.findOne({ designationName: req.body.designationName });
    if (existingDesignation) {
      return res.status(400).json({ message: 'Designation with this name already exists' });
    }

    // If no duplicate found, create and save the new designation
    const newDesignation = new Designation(req.body);
    await newDesignation.save();
    res.status(201).json(newDesignation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing designation by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDesignation = await Designation.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedDesignation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a designation by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Designation.findByIdAndDelete(id);
    res.status(200).json({ message: 'Designation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a designation by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json(designation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all designations
router.get('/get', async (req, res) => {
  try {
    const designations = await Designation.find();
    res.json(designations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
