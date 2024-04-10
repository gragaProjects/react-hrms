const express = require('express');
const router = express.Router();
const { Department, Country } = require("../models");

// // Add a new country

router.post('/add', async (req, res) => {
  try {
    // Check if a country with the same name already exists
    const existingCountry = await Country.findOne({ countryName: req.body.countryName });
    if (existingCountry) {
      return res.status(400).json({ message: 'Country with this name already exists' });
    }

    // If no duplicate found, create and save the new country
    const newCountry = new Country(req.body);
    await newCountry.save();
    res.status(201).json(newCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add country data
router.post('/addCountry', async (req, res) => {
  try {
    const countries = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia (formerly Macedonia)", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Sudan, South", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates (UAE)", "United Kingdom (UK)", "United States of America (USA)", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City (Holy See)", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    for (let countryName of countries) {
      // Check if a country with the same name already exists
      const existingCountry = await Country.findOne({ countryName });
      if (!existingCountry) {
        // If no duplicate found, create and save the new country
        const newCountry = new Country({ countryName });
        await newCountry.save();
      }
    }

    res.status(201).json({ message: 'All countries inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing country by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCountry = await Country.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a country by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Country.findByIdAndDelete(id);
    res.status(200).json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a country by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all countries
router.get('/get', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
