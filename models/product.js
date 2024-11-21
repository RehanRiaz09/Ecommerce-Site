const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
name: {type: String, required: true},
description: {type: String, required: true},
image: {type: String},
brand: {type: String, default: ''},
price: {type: String, requied: true},
category: {type: mongoose.Schema.Types.ObjectId, required: true},
rating: {type: Number, default: 3},
countInStock: {type: String, required: true, min: 0, max: 255},
numReviews:{type: Number, default: 10},
isFeature: {type: Boolean, default: false},
dateCreate: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Product", productSchema);