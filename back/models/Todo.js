const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
	todo: String,
	check: {
		type: Boolean,
		default: false
	}
})

const Todo = new mongoose.model("Todo", todoSchema)
module.exports = Todo