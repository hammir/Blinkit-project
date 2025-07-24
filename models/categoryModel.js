const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters long']
  }
}, { timestamps: true });

const categoryModel = mongoose.model("Category", categorySchema);

// --------------------
// JOI Validation Schema & Function
// --------------------
const categoryJoiSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 2 characters long',
    'any.required': 'Category name is required'
  })
});

function validateCategory(data) {
  return categoryJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  categoryModel,
  validateCategory
};
