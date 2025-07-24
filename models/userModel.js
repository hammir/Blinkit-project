const mongoose = require('mongoose');
const Joi = require('joi');

// --------------------
// Mongoose Schema with Detailed Validations
// --------------------
const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zip: {
    type: Number,
    required: [true, 'Zip code is required'],
    validate: {
      validator: function(v) {
        // Ensure zip is a 5-digit integer
        return Number.isInteger(v) && v.toString().length === 6;
      },
      message: props => `${props.value} is not a valid zip code! It should be a 6-digit number.`
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: Number,
    // required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        // Ensure phone is a 10-digit integer
        return Number.isInteger(v) && v.toString().length === 10;
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  // addresses: {
  //   type: [addressSchema],
  //   validate: {
  //     validator: function(v) {
  //       return Array.isArray(v) && v.length > 0;
  //     },
  //     message: 'At least one address is required.'
  //   }
  // }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

// --------------------
// JOI Validation Schemas with Detailed Rules
// --------------------
const addressJoiSchema = Joi.object({
  city: Joi.string().trim().required().messages({
    'string.base': 'City must be a string',
    'any.required': 'City is required'
  }),
  state: Joi.string().trim().required().messages({
    'string.base': 'State must be a string',
    'any.required': 'State is required'
  }),
  zip: Joi.number().integer().required().messages({
    'number.base': 'Zip code must be a number',
    'number.integer': 'Zip code must be an integer',
    'any.required': 'Zip code is required'
  }).custom((value, helpers) => {
    if (value.toString().length !== 6) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'any.invalid': 'Zip code must be a 6-digit number'
  }),
  address: Joi.string().trim().required().messages({
    'string.base': 'Address must be a string',
    'any.required': 'Address is required'
  })
});

const userJoiSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  phone: Joi.number().integer().messages({
    'number.base': 'Phone number must be a number',
    'number.integer': 'Phone number must be an integer',
    'any.required': 'Phone number is required'
  }).custom((value, helpers) => {
    if (value.toString().length !== 10) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'any.invalid': 'Phone number must be a 10-digit number'
  }),
  // addresses: Joi.array().items(addressJoiSchema).min(1).required().messages({
  //   'array.base': 'Addresses must be an array',
  //   'array.min': 'At least one address is required',
  //   'any.required': 'Addresses are required'
  // })
});

function validateUser(data) {
  return userJoiSchema.validate(data, { abortEarly: false });
}

// --------------------
// Exports
// --------------------
module.exports = {
  userModel,
  validateUser
};
