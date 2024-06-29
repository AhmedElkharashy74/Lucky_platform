const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure category names are unique
    index: true // Add an index for faster queries
  },
  description: {
    type: String,
    required: false // Optional description field
  },
  image: {
    type: String,
    required: false // Optional image field
  }
}, {
  timestamps: true // Add createdAt and updatedAt fields
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
