const express = require('express');
const taskRouter = new express.Router();
const Task = require('../models/taskModel');


// Create tasks route
taskRouter.post('/tasks', async (req, res) => {

    const task = new Task(req.body);
    try {
        const savedTask = await task.save();
        savedTask
        ? res.status(201).send(savedTask)
        : res.status(400).send('The user was not saved')
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get all tasks route

taskRouter.get('/tasks', async (req, res) => {
    try {
        const allTasks = await Task.find({})
        allTasks
        ? res.status(201).send(allTasks)
        : res.status(400).send(`There are no tasks`)
    } catch (error) {
        res.status(500).send(error)
    }

})

// Get task by ID
taskRouter.get('/tasks/:id', async (req, res) => {
    const taskID = req.params.id
    try {
        const requestedTask = await Task.findById(taskID)       
        requestedTask
        ? res.status(201).send(requestedTask)
        : res.status(400).send(`There's no task with such ID`)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update task by ID
taskRouter.patch('/tasks/:id', async (req, res) => {
    const taskID = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (isValidOperation) {
        try {
            const task = await Task.findById(taskID);
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

taskRouter.delete('/tasks/:id', async (req, res) => {
    const taskID = req.params.id;
    try {
        await Task.findByIdAndDelete(taskID)
    } catch (error) {
      return res.status(500).send(error)
    }
    try {
        const updatedTaskList = await Task.find({})
        const updatedTaskListLength = updatedTaskList.length
      return updatedTaskList
        ? res.status(201).send({
            tasksLeft: updatedTaskListLength,
            tasksList: updatedTaskList
        })
        : res.status(400).send(`There's no task with such ID`)
    } catch (error) {
       return res.status(500).send(error)
    }
    
})

module.exports = taskRouter