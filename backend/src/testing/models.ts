import { Mongoose, Schema, model } from "mongoose"

const info = {
	started: Number || String,
	ended: Number || String,
	elapsed: String,
	pass: Number,
	fail: Number
}

const id = {
	type: String,
	required: true,
	unique: true
}

const Data = new Schema({
	id,
	tests: {
		type: [ Schema.Types.ObjectId ],
		default: []
	},
	info
}, {
	versionKey: false,
})

const Tests = new Schema({
	title: String,
	tasks: {
		type: [ Schema.Types.ObjectId ],
		default: []
	},
	info
}, {
	versionKey: false
})

const TestingModels = {
	data:	model('Agenda', Data),
	tests: model('Tests', Tests)
}

export default TestingModels