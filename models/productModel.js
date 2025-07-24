const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  stock: {
    type: Boolean,
    required: [true, 'Stock status is required'],
    default: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  }
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

// --------------------
// JOI Validation Schema & Function
// --------------------
const productJoiSchema = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters long',
    'any.required': 'Name is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required'
  }),
  category: Joi.string().trim().required().messages({
    'string.base': 'Category must be a string',
    'string.empty': 'Category is required',
    'any.required': 'Category is required'
  }),
  stock: Joi.boolean().required().messages({
    'boolean.base': 'Stock must be a boolean value',
    'any.required': 'Stock is required'
  }),
  description: Joi.string().trim().min(10).required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters long',
    'any.required': 'Description is required'
  }),
  image: Joi.string().trim().required().messages({
    'string.base': 'Image must be a string',
    'string.empty': 'Image is required',
    'any.required': 'Image is required'
  })
});

function validateProduct(data) {
  return productJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  productModel,
  validateProduct
};
