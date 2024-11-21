const mongoose = require("mongoose")
const orderItemSchema = mongoose.Schema({

    quantity: {type: String, required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: "product"}
});
module.exports = mongoose.model("orderItem", orderItemSchema)