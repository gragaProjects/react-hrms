const express = require('express');
const router = express.Router();
const { Country, State } = require("../models");

// // Add a new state
// router.post('/add', async (req, res) => {
//   try {
//     const newState = new State(req.body);
//     await newState.save();
    
//     // Retrieve the newly saved state with populated country field
//     const populatedState = await State.findById(newState._id).populate('country', 'countryName');

//     res.status(201).json(populatedState);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.post('/add', async (req, res) => {
    try {
      // Check if a state with the same name already exists for the given country
      const existingState = await State.findOne({ stateName: req.body.stateName, country: req.body.country });
      if (existingState) {
        return res.status(400).json({ message: 'State with this name already exists for the selected country' });
      }
  
      // If no duplicate found, create and save the new state
      const newState = new State(req.body);
      await newState.save();
  
      // Retrieve the newly saved state with populated country field
      const populatedState = await State.findById(newState._id).populate('country', 'countryName');
  
      res.status(201).json(populatedState);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/addState', async (req, res) => {
    try {
      const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
      ];
  
      const countryId = '66162549b0dd60198bf41d0d'; // This should be the ID of the country you're associating these states with
  
      for (let stateName of states) {
        // Check if a state with the same name already exists for the given country
        const existingState = await State.findOne({ stateName, country: countryId });
        if (!existingState) {
          // If no duplicate found, create and save the new state
          const newState = new State({ stateName, country: countryId });
          await newState.save();
        }
      }
  
      res.status(201).json({ message: 'All states inserted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
// Update an existing state by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedState = await State.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a state by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await State.findByIdAndDelete(id);
    res.status(200).json({ message: 'State deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a state by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findById(id).populate('country', 'countryName');
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all states
router.get('/get', async (req, res) => {
  try {
    const states = await State.find().populate('country', 'countryName');
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get states by country ID
router.get('/getByCountry/:countryId', async (req, res) => {
    try {
      const states = await State.find({ country: req.params.countryId });
      res.json(states);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
