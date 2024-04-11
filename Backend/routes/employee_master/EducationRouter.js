const express = require('express');
const router = express.Router();
const { Education } = require("../../models");

// Add a new education
router.post('/add', async (req, res) => {
  try {
    // Check if an education with the same title already exists
    const existingEducation = await Education.findOne({ educationTitle: req.body.educationTitle });
    if (existingEducation) {
      return res.status(400).json({ message: 'Education with this title already exists' });
    }

    // If no duplicate found, create and save the new education
    const newEducation = new Education(req.body);
    await newEducation.save();
    res.status(201).json(newEducation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing education by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEducation = await Education.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEducation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an education by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Education.findByIdAndDelete(id);
    res.status(200).json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an education by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findById(id);
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all educations
router.get('/get', async (req, res) => {
  try {
    const educations = await Education.find();
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
