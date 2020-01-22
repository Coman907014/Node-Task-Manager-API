const express = require('express');
const userRouter = new express.Router();
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');
const sendWelcomeEmail = require('../emails/emailAccount');

// Create user
userRouter.post('/users', async (req, res) => {

    const user = await new User(req.body);
    const token = await user.generateAuthToken()

    try {
        const savedUser = await user.save()
        sendWelcomeEmail(user.email, user.name);
        savedUser
        ? res.status(201).send({
            jwt: token,
            user: user
        })
        : res.status(400).send('The user was not saved')
    } catch (error) {
        res.status(500).send(error)
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
            user: user
        })
    } catch(error) {
        res.status(400).send(error)
    }
})
// Logout User
userRouter.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send('User logged out!')
    } catch(error) {
        res.status(500).send(error)
    }
})

// Logout User -> all sessions
userRouter.post('/users/logout/all', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = []
        
        await req.user.save()
        res.send(req.user)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Read User Information
userRouter.get('/users/me', authMiddleware ,async (req, res) => {
    
    res.status(200).send(req.user)
})

// Update User
userRouter.patch('/users/me', authMiddleware , async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (isValidOperation) {
        try {
            const user = req.user;

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

// Delete user
userRouter.delete('/users/me', authMiddleware, async (req, res) => {
    try {
        await req.user.remove()
        res.send(user)
    } catch(error) {
        res.status(500).send()
    }
})

module.exports = userRouter