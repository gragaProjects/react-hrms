const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: true// false
    }
})

const TestUser = mongoose.model("users", UserSchema)

module.exports = TestUser