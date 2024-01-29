const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ToDoSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    }
})

const ToDo = mongoose.model('ToDo', ToDoSchema)
module.exports = ToDo