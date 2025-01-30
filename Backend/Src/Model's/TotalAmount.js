const { default: mongoose } = require("mongoose");

const totalamount = mongoose.Schema({
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
    },
    totalamount:{
        type:String
    }
},{
    timestamps:true
})


const producttotalamount = mongoose.model("Total_Ammount",totalamount)

module.exports = producttotalamount