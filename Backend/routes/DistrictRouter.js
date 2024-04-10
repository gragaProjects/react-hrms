const express = require('express');
const router = express.Router();
const { Country, State, District } = require("../models");

// Add a new district
router.post('/add', async (req, res) => {
    try {
      // Check if a district with the same name already exists within the same state
      const existingDistrict = await District.findOne({ districtName: req.body.districtName, state: req.body.state });
      if (existingDistrict) {
        return res.status(400).json({ message: 'District with this name already exists within the selected state' });
      }
  
      // If no duplicate found, create and save the new district
      const newDistrict = new District(req.body);
      await newDistrict.save();
  
      const populatedState = await District.findById(newDistrict._id)
      .populate('country', 'countryName')
      .populate('state', 'stateName');

      //console.log(populatedState);
         res.status(201).json(populatedState);

     // res.status(201).json(newDistrict);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Update an existing district by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDistrict = await District.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedDistrict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a district by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await District.findByIdAndDelete(id);
    res.status(200).json({ message: 'District deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a district by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const district = await District.findById(id).populate('state', 'stateName').populate('country', 'countryName');
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.json(district);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all districts
router.get('/get', async (req, res) => {
  try {
    const districts = await District.find().populate('state', 'stateName').populate('country', 'countryName');
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get districts by state ID
router.get('/getByState/:stateId', async (req, res) => {
    try {
        console.log(req.params.stateId);
      const districts = await District.find({ state: req.params.stateId }).populate('state', 'stateName').populate('country', 'countryName');
      res.json(districts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// router.get('/getByState/:stateId', async (req, res) => {
//     try {
//         const { stateId } = req.params;
//         if (!stateId) {
//             return res.status(400).json({ message: 'State ID is missing in the request' });
//         }
//         const districts = await District.find({ state: stateId }).populate('state', 'stateName').populate('country', 'countryName');
//         res.json(districts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });




module.exports = router;
