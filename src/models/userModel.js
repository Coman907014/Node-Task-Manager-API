const mongoose = require('mongoose');
const validator = require('validator');
const userPasswordHashing = require('../utils/passwordHashing')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    age:{
        type: Number,
        required: true,
        default: 1,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number.')
            }
        }
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.length <= 6) {
                throw new Error('The password needs to have at least 6 characters')
            } else if (value.includes('password')) {
                throw new Error('The password field should not contain the word: password')
            }
        }
    },
    tokens: [{
        token: {
            type:String,
            required: true
        }
    }],
})
// Find user by email and compare input with hashed password.
userSchema.statics.findByCredentials = async (inputEmail, inputPassword) => {
    const user = await User.findOne({email: inputEmail})
    if (!user) {
        throw new Error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(inputPassword, user.password)

    if(!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}

// Methods are accessible on the instances
// Static methods are accessible on the models
// Hash the plain text pass before saving

// userSchema method for generating a JWT
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, 'taskapp')
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
// userSchema method for generating the public user information
// Password, tokens, and all sensitive data were removed
// This toJSON method will be applied to all responses which send the user information
// It is called natively by Node, so it sends stringified data, 
// We just added some modifications to it
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password;
    delete userObject.tokens;

    return userObject
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
       user.password = await userPasswordHashing.userInputToHash(user.password)
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;