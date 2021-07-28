/** Creating our model for mongodb */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema/Model
const IdeaSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	details: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('ideas', IdeaSchema);