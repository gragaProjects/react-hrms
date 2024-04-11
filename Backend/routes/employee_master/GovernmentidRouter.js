const express = require('express');
const router = express.Router();
const { GovernmentID } = require("../../models");

// Add a new government ID
router.post('/add', async (req, res) => {
  try {
    // Check if a government ID with the same value already exists
    const existingGovernmentID = await GovernmentID.findOne({ governmentID: req.body.governmentID });
    if (existingGovernmentID) {
      return res.status(400).json({ message: 'Government ID with this value already exists' });
    }

    // If no duplicate found, create and save the new government ID
    const newGovernmentID = new GovernmentID(req.body);
    await newGovernmentID.save();
    res.status(201).json(newGovernmentID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing government ID by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedGovernmentID = await GovernmentID.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedGovernmentID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a government ID by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await GovernmentID.findByIdAndDelete(id);
    res.status(200).json({ message: 'Government ID deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a government ID by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const governmentID = await GovernmentID.findById(id);
    if (!governmentID) {
      return res.status(404).json({ message: 'Government ID not found' });
    }
    res.json(governmentID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all government IDs
router.get('/get', async (req, res) => {
  try {
    const governmentIDs = await GovernmentID.find();
    res.json(governmentIDs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
