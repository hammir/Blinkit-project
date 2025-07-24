const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: [true, 'Order reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number']
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    trim: true,
  },
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    trim: true,
  },
  transactionID: {
    type: String,
    required: [true, 'Transaction ID is required'],
    trim: true
  }
}, { timestamps: true });

const paymentModel = mongoose.model("Payment", paymentSchema);

// --------------------
// JOI Validation Schema & Function
// --------------------
const paymentJoiSchema = Joi.object({
  order: Joi.string().required().messages({
    'any.required': 'Order id is required'
  }),
  amount: Joi.number().min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
  method: Joi.string().trim().required().messages({
    'any.required': 'Payment method is required'
  }),
  status: Joi.string().trim().required().messages({
    'any.required': 'Payment status is required'
  }),
  transactionID: Joi.string().trim().required().messages({
    'string.base': 'Transaction ID must be a string',
    'any.required': 'Transaction ID is required'
  })
});

function validatePayment(data) {
  return paymentJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  paymentModel,
  validatePayment
};
