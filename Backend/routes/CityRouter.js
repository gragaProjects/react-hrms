const express = require('express');
const router = express.Router();
const { Country, State, District, City } = require("../models");

// Add a new city
// router.post('/add', async (req, res) => {
//   try {
//     // Check if a city with the same name already exists within the same district
//     const existingCity = await City.findOne({ cityName: req.body.cityName, district: req.body.district });
//     if (existingCity) {
//       return res.status(400).json({ message: 'City with this name already exists within the selected district' });
//     }

//     // If no duplicate found, create and save the new city
//     const newCity = new City(req.body);
//     await newCity.save();
//     res.status(201).json(newCity);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.post('/add', async (req, res) => {
    try {
      // Check if a city with the same name already exists within the same district
      const existingCity = await City.findOne({ cityName: req.body.cityName, district: req.body.district });
      if (existingCity) {
        return res.status(400).json({ message: 'City with this name already exists within the selected district' });
      }
    // If no duplicate found, create and save the new district
    const newCity = new City(req.body);
    await newCity.save();

    const populatedState = await City.findById(newCity._id)
    .populate('country', 'countryName')
    .populate('state', 'stateName')
    .populate('district', 'districtName');

    res.status(201).json(populatedState);
  
    //  res.status(201).json(newCity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Update an existing city by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCity = await City.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a city by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await City.findByIdAndDelete(id);
    res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a city by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id).populate('district', 'districtName').populate('state', 'stateName').populate('country', 'countryName');
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all cities
router.get('/get', async (req, res) => {
  try {
    const cities = await City.find().populate('district', 'districtName').populate('state', 'stateName').populate('country', 'countryName');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get districts by state ID
router.get('/getByDistrict/:districtId', async (req, res) => {
  try {
     // console.log(req.params.districtId);
    const citys = await City.find({ district: req.params.districtId }).populate('state', 'stateName').populate('country', 'countryName').populate('district', 'districtName');
    res.json(citys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
