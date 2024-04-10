const express = require('express');
const router = express.Router();
const { TimeZone } = require("../models");

// Add a new time zone
router.post('/add', async (req, res) => {
  try {
    console.log(req.body.timezone);
    // Check if a time zone with the same name already exists
    const existingTimeZone = await TimeZone.findOne({ timezone: req.body.timezone });
    if (existingTimeZone) {
      return res.status(400).json({ message: 'Time zone with this name already exists' });
    }

    // If no duplicate found, create and save the new time zone
    const newTimeZone = new TimeZone(req.body);
    await newTimeZone.save();
    res.status(201).json(newTimeZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing time zone by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTimeZone = await TimeZone.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTimeZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a time zone by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await TimeZone.findByIdAndDelete(id);
    res.status(200).json({ message: 'Time zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a time zone by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const timeZone = await TimeZone.findById(id);
    if (!timeZone) {
      return res.status(404).json({ message: 'Time zone not found' });
    }
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all time zones
router.get('/get', async (req, res) => {
  try {
    const timeZones = await TimeZone.find();
    res.json(timeZones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
