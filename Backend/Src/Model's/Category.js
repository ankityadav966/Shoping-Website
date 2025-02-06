const { default: mongoose } = require("mongoose");

const catigory = mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    Product_Name: {
        type: String,
        required: true,
    },
    images: [
        {
            url: { type: String, required: true },
            alt: { type: String, required: false },
        }
    ],
    description: [{
        Color: {
            type: String
        },
        ModelNumber:{
            type:String
        },
        DialShape:{
            type: String
        },
        Size:{
            type:String
        }
    }],
    price: {
        type: Number,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    offer: {
        type: Number,
        default: null,
    },
    quantity: {
        type: Number, 
        required: true,
        default: 1, 
      },
      prooduct_category:{
        type:String,
        required:true
      }
}, {
    timestamps: true
})
catigory.methods.getTotalAmount = function () {
    return this.price * this.quantity;
  };


  const categorymodel = mongoose.model("categorys", catigory)

  module.exports = categorymodel;
