const { default: mongoose } = require("mongoose");

const addtocatrd = mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorys'
    },
    quantity:{
        type:Number
    }
},{
    timestamps:true
})
const addtocard = mongoose.model("addtocard", addtocatrd)

module.exports = addtocard