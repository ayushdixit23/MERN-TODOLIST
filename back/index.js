const express = require("express")
const mongoose = require("mongoose")
const Todo = require("./models/Todo")
const cors = require("cors")
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/myDataBase").then(() => {
	console.log("database connected")
}).catch((err) => {
	console.log(err)
})

app.post("/add", async (req, res) => {
	try {
		const data = req.body
		console.log(data)
		const newtodo = new Todo({
			todo: data.todo,
			check: data.check
		})
		const resData = await newtodo.save()
		res.status(200).json({ resData, success: true })
	} catch (err) {
		res.json(err.message)
		console.log(err)
	}
})

app.post("/edit/:id", async (req, res) => {
	try {
		const { id } = req.params
		const data = req.body
		const findTodo = await Todo.findByIdAndUpdate({ _id: id }, { $set: { todo: data.todo, check: data.check } })
		res.status(200).json({ findTodo, success: true })
	} catch (err) {
		res.json(err.message)
		console.log(err)
	}
})

app.get("/fetchTodo", async (req, res) => {
	try {
		const resData = await Todo.find()
		console.log(resData)
		res.status(200).json(resData)
	} catch (err) {
		res.json(err.message)
		console.log(err)
	}
})

app.delete("/delete/:todoid", async (req, res) => {
	try {
		const { todoid } = req.params
		const findTodo = await Todo.findByIdAndDelete(todoid)
		res.status(200).json({ success: true })
	} catch (err) {
		console.log(err)
	}
})

app.listen(PORT, () => [
	console.log(`connected on ${PORT}`)
])