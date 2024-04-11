const express = require('express');
const router = express.Router();
const { Currency } = require("../../models");

// Add a new currency
router.post('/add', async (req, res) => {
  try {
    // Convert currencyName to lowercase for case-insensitive comparison
    const currencyNameLowerCase = req.body.currencyName.toLowerCase();

    // Check if a currency with the same name already exists (case-insensitive)
    const existingCurrency = await Currency.findOne({ currencyName: { $regex: new RegExp('^' + currencyNameLowerCase + '$', 'i') } });
    if (existingCurrency) {
      return res.status(400).json({ message: 'Currency with this name already exists' });
    }

    // If no duplicate found, create and save the new currency
    const newCurrency = new Currency(req.body);
    await newCurrency.save();
    res.status(201).json(newCurrency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing currency by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCurrency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a currency by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Currency.findByIdAndDelete(id);
    res.status(200).json({ message: 'Currency deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a currency by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all currencies
router.get('/get', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
