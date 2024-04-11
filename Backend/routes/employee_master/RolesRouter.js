const express = require('express');
const router = express.Router();
const { Role } = require("../../models");

// Add a new role name
router.post('/add', async (req, res) => {
  try {
    // Check if a role name with the same name already exists
    const existingRoleName = await Role.findOne({ roleName: req.body.roleName });
    if (existingRoleName) {
      return res.status(400).json({ message: 'Role name with this name already exists' });
    }

    // If no duplicate found, create and save the new role name
    const newRoleName = new Role(req.body);
    await newRoleName.save();
    res.status(201).json(newRoleName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing role name by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRoleName = await Role.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedRoleName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a role name by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: 'Role name deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a role name by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roleName = await Role.findById(id);
    if (!roleName) {
      return res.status(404).json({ message: 'Role name not found' });
    }
    res.json(roleName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all role names
router.get('/get', async (req, res) => {
  try {
    const roleNames = await Role.find();
    res.json(roleNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
