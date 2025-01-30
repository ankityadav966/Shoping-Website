const { default: mongoose } = require("mongoose");
const addtocard = require("../../Model's/AddTOCard");
const buy = require("../../Model's/BuyNow");
const categorymodel = require("../../Model's/Category");
const usermodel = require("../../Model's/UserRegisterSchema");

const addproduct = async (req, res) => {
    try {

        const { categoryid, quantity } = req.body;
        if (!categoryid) {
            res.status(404).json({
                error: "Product not found in the database"
            });
        }
        const existdata = await categorymodel.findOne({ _id: categoryid })
        // if (existdata) {
        //     throw new Error("This product already exists.");
        //   }        
        // if (product) { 
        //     res.status(409).json({
        //         error: "Product already exists"
        //     });
        // }
        const userdata = await usermodel.find({ Email: req.user.Email })
        // console.log("user data : ", data[0]._id)
        const findtodata = userdata[0]._id;
        console.log(findtodata)


        const findbyprice = await categorymodel.find()

        const totalamount = findbyprice[0].price * quantity
        const useremail = await categorymodel.find()
        const data = await addtocard.create({
            UserId: findtodata,
            categoryid: categoryid,
            quantity: quantity
        })

        res.status(200).json({
            status: "001",
            data: data,
            TotalAmount: totalamount
        })
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
}

const quantityUpdate = async (req, res) => {
    try {
        const userdetails = await usermodel.find({ Email: req.user.Email });

        const { productId } = req.body;
        const findbyprice = await categorymodel.find({ _id: productId });

        if (findbyprice.length > 0) {
            const currentQuantity = findbyprice[0]?.quantity || 0; // Fetch the current quantity, default to 0 if not found

            const updatedProduct = await categorymodel.findOneAndUpdate(
                { _id: productId },
                { $set: { quantity: currentQuantity + 1 } }
            );

            res.status(200).json({
                data: updatedProduct
            });
        } else {
            console.log("Product not found.");
            res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
};
const likesquintaty = async (req, res) => {
    try {
        const { productId } = req.body;
        const data = await categorymodel.find({ _id: productId });
        if (data.length > 0) {
            const likes = data[0].likes || 0
            const updatelikes = await categorymodel.findOneAndUpdate(
                { _id: productId },
                { $set: { likes: likes + 1 } }
            )
            res.status(200).json({
                status: "001",
                data: updatelikes
            })
        }
        else {
            console.log("Product not found.");
            res.status(404).json({
                message: "Product not found"
            });
        }
        console.log(data)
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
}
const rating = async (req, res) => {
    try {
        const { productid, rating } = req.body;

        // Pehle product find karo
        const product = await categorymodel.findById(productid);

        if (!product) {
            return res.status(404).json({
                status: "404",
                message: "Product not found"
            });
        }
        const updaterating = await categorymodel.findOneAndUpdate(
            { _id: productid },
            { rating: rating }
        );
        res.status(200).json({
            status: "001",
            data: updaterating
        });
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred",
            error: error.message
        });
    }
};




const total = async (req, res) => {
    try {
        // console.log(req.user.Email)
        const data = await usermodel.find({ Email: req.user.Email })
        const findtodata = data[0]._id;
        const finaldata = await categorymodel.find({ UserId: findtodata }).lean()
        const data2 = await finaldata.map(item => {
            console.log(item, "i");
            const newprice = item.price - (item.price / 100 * parseInt(item.offer))
            item.DiscountedPrice = newprice
            console.log("all descount : ", item)
        });

        res.status(200).json({
            User: data,
            finaldata: finaldata,
            // loopingfordat: loopingfordat
        })
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
}
// const buydata = async (req, res) => {
//     try {
//         const { UserId } = req.body;

// if(!UserId){
//     console.log("this id is not exist : ")
// }
//         const data = await usermodel.find();
//         console.log("this daatta ",data)
//         const userrdata = data[0].Address[0].Address + "," + data[0].Address[0].village + "," + data[0].Address[0].PinCodeNumber
//         const userdetails = await categorymodel.find({ UserId: UserId })


//         //  const mapforaccessdata = userdetails.map(item=>[item.price , item.quantity])
//         if(!userdetails){
//             console.log("Id Not Exist: ")
//         }
//         const mapforaccessdata = userdetails.map((item) => {
//             return {
//                 price: item.price,
//                 quantity: item.quantity
//             }
//         })


//         const totalPrice = mapforaccessdata.reduce((prev, curr) => {
//             let a = prev.price + curr.price
//             let b = prev.quantity + curr.quantity
//             return {
//                 price: a,
//                 quantity: b,
//                 data: a * b
//             }
//         },
//         { price: 0, quantity: 0, data: 0 })
//         const UserTotalPrice = totalPrice.data

//         // buy.insertMany(UserTotalPrice)

//         res.send({
//             userdata: userrdata,
//             UserTotalPrice: UserTotalPrice
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
const buydata = async (req, res) => {
    try {
        const userdetails = await usermodel.find({ Email: req.user.Email })
        const userbyallproduct = await categorymodel.find({ UserId: userdetails[0]._id }).lean();

        let totalDiscountedPrice = 0;
        const data2 = await userbyallproduct.map(item => {
            const newprice = item.price - (item.price / 100 * parseInt(item.offer))
            item.DiscountedPrice = newprice
            console.log("all descount : ", item)

            // const jointto_offer = price.reduce((pre,cur)=>{
            //     return pre+cur
            // })
            // console.log(jointto_offer)
            totalDiscountedPrice += newprice;

            item.totalDiscountedPrice = totalDiscountedPrice;
        });
        const userrdata =
            userdetails[0].Address[0].Address + ","
            +
            userdetails[0].Address[0].village + ","
            +
            userdetails[0].Address[0].PinCodeNumber;
        console.log(userrdata)

        res.status(200).json({
            userdetails: userdetails,
            userDetails: userrdata,
            totalDiscountedPrice: totalDiscountedPrice
        })





    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Internal server error" });
    }
};


const product_pricefilter = async (req, res) => {
    try {
        const { order } = req.body;

        const allproduct = await categorymodel.find().sort([["price", "asc" ? "desc" : ""]]);
        const allproductprice = allproduct.map(item => item.price);
        console.log("Sorted Prices:", allproductprice);

        res.status(200).json({ sortedPrices: allproductprice });
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
};

const min_max_price = async (req, res) => {
    try {
        let { minPrice, maxPrice } = req.body;

        minPrice = parseInt(minPrice);
        maxPrice = parseInt(maxPrice);


        const allProducts = await categorymodel.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        console.log("All Products:", allProducts);

        return res.status(200).json({
            status: "200",
            message: "Products fetched successfully",
            data: allProducts
        });
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during fetching products",
            error: error.message
        });
    }
}


const discountwithproduct = async (req, res) => {
    try {
        const { maxdiscount, mindiscount } = req.body;
        // maxdiscount = parseInt(maxdiscount);
        // mindiscount = parseInt(maxdiscount)

        if (!maxdiscount || !mindiscount) {
            return res.status(400).json({
                status: "400",
                message: "maxdiscount and mindiscount are required."
            });
        }


        const data = await categorymodel.find({
            offer: { $gte: parseInt(mindiscount), $lte: parseInt(maxdiscount) }
        });

        return res.status(200).json({
            status: "001",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred",
            error: error.message
        });
    }
};

const favoriteColor = async (req, res) => {
    try {
        const { color } = req.body
        const data = await categorymodel.find({
            description: {
                $elemMatch: { Color: color }
            }
        });

        // const colordata = data.map(item => item.description[0])


        // const find_data = await categorymodel.find({
        //     colordata: color
        // })
        res.status(200).json({
            status: '9090',
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred",
            error: error.message
        });
    }
}


const searchapi = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query
        const offset = parseInt((page - 1) * limit)

        const data = await categorymodel.find({ Product_Name: { $regex: `${search}`, $options: 'i' } }).skip(offset).limit(limit)

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No matching records found' });
        }

        return res.status(200).json({ data: data });


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal server error', error: error.message });

    }

}
const profile = async (req, res) => {
    try {

        const data = await usermodel.find({});
        res.status(200).json({
            status: "00001",
            data: data
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}




module.exports =
{
    addproduct,
    quantityUpdate,
    total,
    buydata,
    product_pricefilter,
    min_max_price,
    discountwithproduct,
    favoriteColor,
    searchapi,
    profile,
    likesquintaty,
    rating
}
