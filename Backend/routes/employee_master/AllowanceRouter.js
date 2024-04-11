const express = require('express');
const router = express.Router();
const { Allowance } = require("../../models");

// Add a new allowance
router.post('/add', async (req, res) => {
  try {
    // Convert allowance name to lowercase for case-insensitive comparison
    const allowanceLowerCase = req.body.allowance.toLowerCase();

    // Check if an allowance with the same name already exists (case-insensitive)
    const existingAllowance = await Allowance.findOne({ allowance: { $regex: new RegExp('^' + allowanceLowerCase + '$', 'i') } });
    if (existingAllowance) {
      return res.status(400).json({ message: 'Allowance with this name already exists' });
    }

    // If no duplicate found, create and save the new allowance
    const newAllowance = new Allowance(req.body);
    await newAllowance.save();
    res.status(201).json(newAllowance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing allowance by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAllowance = await Allowance.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedAllowance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an allowance by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Allowance.findByIdAndDelete(id);
    res.status(200).json({ message: 'Allowance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an allowance by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowance = await Allowance.findById(id);
    if (!allowance) {
      return res.status(404).json({ message: 'Allowance not found' });
    }
    res.json(allowance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all allowances
router.get('/get', async (req, res) => {
  try {
    const allowances = await Allowance.find();
    res.json(allowances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
