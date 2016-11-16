'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
	_id: { type: String, unique: true },
	name: String,
	url: String,
	image_url: String,
	address: String,
	city: String,
	state: String,
	zip: String,
	snippet: String,
	attendance: Array
});

module.exports = mongoose.model('Bar', Bar);
