const quiggleSchema = {
	t_added: {
		type: Number,
		required: true
	},
	t_changed: {
		type: Number,
		default: -1
	}
}

export { quiggleSchema }