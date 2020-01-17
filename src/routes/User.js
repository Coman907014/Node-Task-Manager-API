const express = require('express');
const userRouter = new express.Router();
const User = require('../models/userModel');

// Create user
userRouter.post('/users', async (req, res) => {

    const user = await new User(req.body);
    const token = await user.generateAuthToken()

    try {
        const savedUser = await user.save()
        savedUser
        ? res.status(201).send({
            jwt: token,
            savedUser
        })
        : res.status(400).send('The user was not saved')
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get all users
userRouter.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find({})
        allUsers
        ? res.status(201).send(allUsers)
        : res.status(400).send(`There's no users`)
    } catch (error) {
        res.status(500).send(error)
    }

})

// Get user by ID
userRouter.get('/users/:id', async (req, res) => {
    try {
        const userID = req.params.id;
        const requestedUser = await User.findById(userID)
        requestedUser
        ? res.status(200).send(requestedUser)
        : res.status(404).send('No user found with this ID.')
    } catch (error) {
        res.status(500).send(error)
    }
})


// Update User
userRouter.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (isValidOperation) {
        try {
            const user = await User.findById(req.params.id);
            updates.forEach((update) => user[update] = req.body[update])
            await user.save()
            return user
                ? res.status(201).send(user)
                : res.status(400).send(`There's no task with such ID`)
        } catch (error) {
           return res.status(500).send(error)
        }
    } else {
        return res.status(400).send(`Cannot updated those fields`)
    }
})


// Login User
userRouter.post('/users/login', async (req, res) => {
    try {
        // Using the user model when we don't work with a specific user
        // E.g. Searching through the DB for a certain user
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // We user the generated user constant when we manipulate a certain user
        // E.g. Found the user by ID and we are updating it.
        // Model vs Instance!
        // The bellow method is being defined in the userSchema as a method
        const token = await user.generateAuthToken()
        return res.send({
            jwt: token,
            user
        })
    } catch(error) {
        res.status(400).send(error)
    }
})

module.exports = userRouter