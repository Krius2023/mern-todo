const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ToDo = require('./model/toDoModel')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/mern-todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log('Error in enabling MongoDB connection', err))


app.get('/ToDos', async (req, res) => {
    const toDos = await ToDo.find()
    res.status(200).json({ 'message': 'To Dos are Fetched Successfully', body: { toDos } })
})

app.post('/ToDos/Create', async (req, res) => {
    const toDo = new ToDo({
        content: req.body.content
    })
    await toDo.save()
    res.status(201).json({ message: 'Todo Created Successfully', body: toDo })
})

app.post('/ToDos/Delete', async (req, res) => {
    const result = await ToDo.findByIdAndDelete(req.body.toDoId)
    if (!result) {
        res.status(404).json({ message: 'ToDo not found' })
    }
    res.status(200).json({ message: 'Todo Deleted Successfully', body: result })
})

app.post('/ToDos/Update', async (req, res) => {
    const { toDoId, updateKey, updateValue } = req.body
    const result = await ToDo.findByIdAndUpdate(toDoId, {
        [updateKey]: `${updateValue}`
    })
    res.status(200).send({ message: 'Todo Updated Successfully', body: result })
})

app.listen(5000, () => console.log('Server started on port 5000:: http://localhost:5000'))
