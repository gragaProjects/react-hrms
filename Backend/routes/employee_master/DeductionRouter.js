const express = require('express');
const router = express.Router();
const { Deduction } = require("../../models");

// Add a new deduction
router.post('/add', async (req, res) => {
  try {
    // Convert deduction name to lowercase for case-insensitive comparison
    const deductionLowerCase = req.body.deduction.toLowerCase();

    // Check if a deduction with the same name already exists (case-insensitive)
    const existingDeduction = await Deduction.findOne({ deduction: { $regex: new RegExp('^' + deductionLowerCase + '$', 'i') } });
    if (existingDeduction) {
      return res.status(400).json({ message: 'Deduction with this name already exists' });
    }

    // If no duplicate found, create and save the new deduction
    const newDeduction = new Deduction(req.body);
    await newDeduction.save();
    res.status(201).json(newDeduction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing deduction by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDeduction = await Deduction.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedDeduction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a deduction by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Deduction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deduction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a deduction by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deduction = await Deduction.findById(id);
    if (!deduction) {
      return res.status(404).json({ message: 'Deduction not found' });
    }
    res.json(deduction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all deductions
router.get('/get', async (req, res) => {
  try {
    const deductions = await Deduction.find();
    res.json(deductions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
