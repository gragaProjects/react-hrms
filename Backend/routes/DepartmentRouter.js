const express = require('express');
const router = express.Router();
const { Department } = require("../models");

// Add a new department
// router.post('/add', async (req, res) => {
//   try {
//     const newDepartment = new Department(req.body);
//     await newDepartment.save();
//     res.status(201).json(newDepartment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.post('/add', async (req, res) => {
  try {
    // Check if a department with the same name already exists
    const existingDepartment = await Department.findOne({ departmentName: req.body.departmentName });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department with this name already exists' });
    }

    // If no duplicate found, create and save the new department
    const newDepartment = new Department(req.body);
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update an existing department by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a department by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a department by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all departments
router.get('/get', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
