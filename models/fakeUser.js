const mongoose = require("mongoose")
const fakeUserSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    avatar: {type: String, required: true},
    password: {type: String, required: true},
    birthdate: {type: Date, required: true},    
    registeredAt: {type: Date, required: true},
});
module.exports = mongoose.model("fakeUser", fakeUserSchema)