const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, 'User reference is required']
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: [true, 'Product reference is required']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    trim: true,
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: false
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
    required: false
  }
}, { timestamps: true });

const orderModel = mongoose.model("order", orderSchema);

// --------------------
// JOI Validation Schema & Function
// --------------------
const orderJoiSchema = Joi.object({
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
  }),
  address: Joi.string().trim().required().messages({
    'string.base': 'Address must be a string',
    'any.required': 'Address is required'
  }),
  status: Joi.string().trim().required().messages({
    'any.required': 'Status is required'
  }),
  payment: Joi.string(),
  delivery: Joi.string(),
});

function validateOrder(data) {
  return orderJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  orderModel,
  validateOrder
};
