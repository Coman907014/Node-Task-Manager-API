const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        // The userId will be a mongoose ObjectId
        type: mongoose.Schema.Types.ObjectId,
        required: true,

    }
})

module.exports = Task;