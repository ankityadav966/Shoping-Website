const { default: mongoose } = require("mongoose");

const database = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/Shoping_Website')
        console.log("Database Connect Successfull : ");

    } catch (error) {
        console.lolg("Not Connect : ",error)
    }
}

module.exports = database