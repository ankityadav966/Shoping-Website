const { default: mongoose } = require("mongoose");

const productbuy = mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorys'
    },
    totalamount :{
        type:Number
    },
    quantity:{
        type:Number
    },
})


const buy = mongoose.model("Buy",productbuy);

module.exports = buy;