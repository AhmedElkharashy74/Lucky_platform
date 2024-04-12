const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // You can add more fields like category description, image, etc.
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
