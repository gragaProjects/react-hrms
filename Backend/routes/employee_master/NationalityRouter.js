const express = require('express');
const router = express.Router();
const { Nationality } = require("../../models");

// Add a new nationality
router.post('/add', async (req, res) => {
  try {
    // Check if a nationality with the same name already exists
    const existingNationality = await Nationality.findOne({ nationalityName: req.body.nationalityName });
    if (existingNationality) {
      return res.status(400).json({ message: 'Nationality with this name already exists' });
    }

    // If no duplicate found, create and save the new nationality
    const newNationality = new Nationality(req.body);
    await newNationality.save();
    res.status(201).json(newNationality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing nationality by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedNationality = await Nationality.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedNationality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a nationality by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Nationality.findByIdAndDelete(id);
    res.status(200).json({ message: 'Nationality deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a nationality by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const nationality = await Nationality.findById(id);
    if (!nationality) {
      return res.status(404).json({ message: 'Nationality not found' });
    }
    res.json(nationality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all nationalities
router.get('/get', async (req, res) => {
  try {
    const nationalities = await Nationality.find();
    res.json(nationalities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to add nationality data
router.post('/addData', async (req, res) => {
  try {
    // Iterate through the provided nationalities and add them to the database
    const nationalities = [
      "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan", "Argentine", "Armenian", 
      "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", 
      "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Botswanan", "Brazilian", "British", 
      "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", 
      "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", 
      "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican", "Dutch", 
      "East Timorese", "Ecuadorean", "Egyptian", "Emirati", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", 
      "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", 
      "Grenadian", "Guatemalan", "Guinean", "Guyanese", "Haitian", "Honduran", "Hungarian", "Icelandic", "Indian", 
      "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", 
      "Kazakhstani", "Kenyan", "Kiribati", "North Korean", "South Korean", "Kuwaiti", "Kyrgyzstani", "Laotian", 
      "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourgish", "Macedonian", 
      "Malagasy", "Malawian", "Malaysian", "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", 
      "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Montenegrin", "Moroccan", 
      "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", 
      "Niuean", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", 
      "Paraguayan", "Peruvian", "Philippine", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", 
      "Saint Lucian"
    ];

    // Iterate through the nationalities array and add them to the database
    for (let nationalityName of nationalities) {
      // Check if a nationality with the same name already exists
      const existingNationality = await Nationality.findOne({ nationalityName });
      if (existingNationality) {
        console.log(`Nationality '${nationalityName}' already exists`);
      } else {
        // If no duplicate found, create and save the new nationality
        const newNationality = new Nationality({ nationalityName });
        await newNationality.save();
        console.log(`Added nationality '${nationalityName}' to the database`);
      }
    }

    res.status(201).json({ message: 'Nationality data added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
