const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  // You can add more fields like purchase date, payment method, etc.
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
