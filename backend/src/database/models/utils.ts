const quiggleSchema = {
	t_added: {
		type: Number,
		required: true
	},
	t_changed: {
		type: Number
	},
	c_dec: {
		type: Object,
		required: true
	}
}

export { quiggleSchema }