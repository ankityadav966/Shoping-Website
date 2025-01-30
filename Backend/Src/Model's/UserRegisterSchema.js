const { default: mongoose, Types } = require("mongoose");

const userscheema = mongoose.Schema({
    Username: {
        type: String
    },
    Email: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    Phone_Number: {
        type: String
    },
    Address: [
    {
        Address: {
            type: String
        },
        PinCodeNumber: {
            type: String
        },
        village: {
            type: String
        },

    }
    ],

    token: {
        type: String
    }
}, {
    timestamps: true
})


const usermodel = mongoose.model("register", userscheema)

module.exports = usermodel