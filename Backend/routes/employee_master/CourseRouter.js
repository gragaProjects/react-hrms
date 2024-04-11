const express = require('express');
const router = express.Router();
const { Course, Education } = require("../../models");

// Add a new course
router.post('/add', async (req, res) => {
  try {
    // Convert courseName to lowercase for case-insensitive comparison
    const courseNameLowerCase = req.body.courseName.toLowerCase();

    // Check if a course with the same name already exists for the given educationLevel
    const existingCourse = await Course.findOne({
      educationLevel: req.body.educationLevel,
      courseName: { $regex: new RegExp('^' + courseNameLowerCase + '$', 'i') }
    });

    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this name already exists for the given education level' });
    }

    // If no duplicate found, create and save the new course
    const newCourse = new Course({
      educationLevel: req.body.educationLevel,
      courseName: req.body.courseName
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing course by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a course by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a course by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all courses
router.get('/get', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
