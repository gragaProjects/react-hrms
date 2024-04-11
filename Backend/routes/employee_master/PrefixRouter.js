const express = require('express');
const router = express.Router();
const { Prefix } = require("../../models");

// Add a new prefix
router.post('/add', async (req, res) => {
  try {
    // Check if a prefix with the same title already exists
    const existingPrefix = await Prefix.findOne({ prefixTitle: req.body.prefixTitle });
    if (existingPrefix) {
      return res.status(400).json({ message: 'Prefix with this title already exists' });
    }

    // If no duplicate found, create and save the new prefix
    const newPrefix = new Prefix(req.body);
    await newPrefix.save();
    res.status(201).json(newPrefix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing prefix by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPrefix = await Prefix.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPrefix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a prefix by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Prefix.findByIdAndDelete(id);
    res.status(200).json({ message: 'Prefix deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a prefix by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prefix = await Prefix.findById(id);
    if (!prefix) {
      return res.status(404).json({ message: 'Prefix not found' });
    }
    res.json(prefix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all prefixes
router.get('/get', async (req, res) => {
  try {
    const prefixes = await Prefix.find();
    res.json(prefixes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
