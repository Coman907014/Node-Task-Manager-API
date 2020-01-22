const express = require('express');
const taskRouter = new express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const Task = require('../models/taskModel');
const mapTaskQueryParamsForPopulateMethod = require('../utils/taskQueryParamsManipulation')
const sendTaskCreatedEmail = require('../emails/emailTasks');
// Create tasks route
taskRouter.post('/tasks', authMiddleware, async (req, res) => {
    const task =  new Task ({
        ...req.body,
        userId: req.user._id
    })
    try {
        const savedTask = await task.save();
        sendTaskCreatedEmail(
            req.user.email,
            req.user.name,
            savedTask.id,
            savedTask.description)
        savedTask
        ? res.status(201).send(savedTask)
        : res.status(400).send('The user was not saved')
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get all tasks route
taskRouter.get('/tasks', authMiddleware, async (req, res) => {
    const { mappedQueryParams, mappedSortingParams } = mapTaskQueryParamsForPopulateMethod(req.query);
    try {
        await req.user.populate({
            path: 'tasks',
            match: mappedQueryParams,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    ...mappedSortingParams
                }
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)

    } catch (error) {
        res.status(500).send(error)
    }

})

// Get task by ID
taskRouter.get('/tasks/:id', authMiddleware , async (req, res) => {
    const taskID = req.params.id
    try {
        const requestedTask = await Task.findOne({ _id: taskID, userId: req.user._id })
        requestedTask
        ? res.status(201).send(requestedTask)
        : res.status(400).send(`There's no task with such ID`)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update task by ID
taskRouter.patch('/tasks/:id', authMiddleware, async (req, res) => {
    const taskID = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (isValidOperation) {
        try {
            const task = await Task.findOne({ _id: taskID, userId: req.user._id })
            updates.forEach(update => task[update] = req.body[update])
            await task.save()
              return  task
                ? res.status(201).send(task)
                : res.status(400).send(`There's no task with such ID`)
        } catch (error) {
           return res.status(500).send(error)
        }
    } else {
        return res.status(400).send(`Cannot updated those fields`)
    }
})

// Delete task by ID
taskRouter.delete('/tasks/:id', authMiddleware , async (req, res) => {
    const taskID = req.params.id;
    try {
        await Task.findOneAndDelete({ _id: taskID, userId: req.user._id})
    } catch (error) {
      return res.status(500).send(error)
    }
    try {
        const updatedTaskList = await Task.find({ userId: req.user._id })
      return updatedTaskList
        ? res.status(201).send({ updatedTaskList })
        : res.status(400).send(`There's no task with such ID`)
    } catch (error) {
       return res.status(500).send(error)
    }
    
})

module.exports = taskRouter