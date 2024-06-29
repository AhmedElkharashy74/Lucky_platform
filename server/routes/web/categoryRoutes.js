const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacherController');

// Get all categories
router.get('/', teacherController.getAllCategories);

// Get a category by ID
router.get('/:id', teacherController.getCategoryById);

// Create a new category
router.post('/', teacherController.createCategory);

// Update an existing category
router.put('/:id', teacherController.updateCategory);

// Delete a category
router.delete('/:id', teacherController.deleteCategory);

module.exports = router;
