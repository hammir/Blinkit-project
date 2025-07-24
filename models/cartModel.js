const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, 'User is required']
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: [true, 'Product is required']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  }
}, { timestamps: true });

const cartModel = mongoose.model("Cart", cartSchema);

// --------------------
// JOI Validation Schema & Function
// --------------------
const cartJoiSchema = Joi.object({
  user: Joi.string().required().messages({
    'any.required': 'User id is required'
  }),
  products: Joi.string().required().messages({
    'any.required': 'Product id is required'
  }),
  totalPrice: Joi.number().min(0).required().messages({
    'number.base': 'Total price must be a number',
    'number.min': 'Total price cannot be negative',
    'any.required': 'Total price is required'
  })
});

function validateCart(data) {
  return cartJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  cartModel,
  validateCart
};
