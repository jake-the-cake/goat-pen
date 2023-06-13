const quiggleSchema = {
	t_added: {
		type: Number,
		required: true
	},
	t_changed: {
		type: Number
	},
	c_: {
		type: String,
		required: true
	}
}

export { quiggleSchema }