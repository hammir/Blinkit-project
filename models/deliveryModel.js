const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: [true, 'Order reference is required']
  },
  deliveryBoy: {
    type: String,
    required: [true, 'Delivery Boy is required'],
    trim: true,
    minlength: [2, 'Delivery Boy must be at least 2 characters long']
  },
  trackingUrl: {
    type: String,
    required: [true, 'Tracking URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  status: {
    type: String,
    required: [true, 'Delivery status is required'],
    trim: true,
    default: 'pending'
  },
  estimatedTime: {
    type: Number,
    required: [true, 'Estimated time is required'],
    min: [0, 'Estimated time must be a non-negative number']
  }
}, { timestamps: true });

const deliveryModel = mongoose.model("Delivery", deliverySchema);

// --------------------
// JOI Validation Schema & Function
// --------------------
const deliveryJoiSchema = Joi.object({
  order: Joi.string().required().messages({
    'any.required': 'Order id is required'
  }),
  deliveryBoy: Joi.string().trim().min(2).required().messages({
    'string.base': 'Delivery Boy must be a string',
    'string.empty': 'Delivery Boy is required',
    'string.min': 'Delivery Boy must be at least 2 characters long',
    'any.required': 'Delivery Boy is required'
  }),
  trackingUrl: Joi.string().trim().pattern(/^https?:\/\/.+/).required().messages({
    'string.pattern.base': 'Please provide a valid tracking URL',
    'any.required': 'Tracking URL is required'
  }),
  status: Joi.string().trim().valid('pending', 'in_transit', 'delivered', 'cancelled').required().messages({
    'any.only': 'Status must be one of: pending, in_transit, delivered, or cancelled',
    'any.required': 'Status is required'
  }),
  estimatedTime: Joi.number().min(0).required().messages({
    'number.base': 'Estimated time must be a number',
    'number.min': 'Estimated time must be a non-negative number',
    'any.required': 'Estimated time is required'
  })
});

function validateDelivery(data) {
  return deliveryJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  deliveryModel,
  validateDelivery
};
