const express = require('express');
const router = express.Router();
const { Language } = require("../../models");

// Add a new language
router.post('/add', async (req, res) => {
  try {
    // Check if a language with the same name already exists
    const existingLanguage = await Language.findOne({ language: req.body.language });
    if (existingLanguage) {
      return res.status(400).json({ message: 'Language with this name already exists' });
    }

    // If no duplicate found, create and save the new language
    const newLanguage = new Language(req.body);
    await newLanguage.save();
    res.status(201).json(newLanguage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing language by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedLanguage = await Language.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedLanguage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a language by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Language.findByIdAndDelete(id);
    res.status(200).json({ message: 'Language deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a language by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const language = await Language.findById(id);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all languages
router.get('/get', async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
