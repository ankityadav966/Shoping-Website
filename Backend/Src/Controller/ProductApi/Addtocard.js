const { default: mongoose } = require("mongoose");
const addtocard = require("../../Model's/AddTOCard");
const buy = require("../../Model's/BuyNow");
const categorymodel = require("../../Model's/Category");
const usermodel = require("../../Model's/UserRegisterSchema");

const addproduct = async (req, res) => {
    try {

        const { categoryid, quantity } = req.body;
        const existdata = await categorymodel.findOne({ _id: categoryid });


        const userdata = await usermodel.findOne({ Email: req.user.Email });
        if (!userdata) {
            return res.status(404).json({ return: "User not found." });
        }

        const findbyprice = await categorymodel.findOne({ _id: categoryid });
        if (!findbyprice) {
            return res.status(404).json({ return: "Category not found." });
        }

        const totalamount = findbyprice.price || findbyprice.price * quantity;


        const existproduct = await addtocard.findOne({ categoryid, UserId: userdata._id });
        if (existproduct) {
            return res.status(400).json({
                exist: "Product already exists in cart."
            });
        }

        const data = await addtocard.create({
            UserId: userdata._id,
            categoryid: categoryid,
            quantity: quantity,
            price: totalamount
        });

        return res.status(200).json({
            status: "001",
            data: data,
            TotalAmount: totalamount
        });

    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
}

// const addproduct = async (req, res) => {
//     try {
//         const { categoryid } = req.body;
//         const userdata = await usermodel.findOne({ Email: req.user.Email });
//         const productdata = await categorymodel.findOne({ _id: categoryid });

//         if (!userdata) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         if (!productdata) {
//             return res.status(400).json({ message: "Product not found" });
//         }

//         const { price, quantity, offer } = productdata;
//         const totalAmount = (price * quantity) * (1 - (offer / 100)); 

//         const data = await addtocard.create({
//             UserId: userdata._id,
//             categoryid: categoryid,
//             quantity: quantity,
//             productprice: totalAmount
//         });

//         res.status(200).json({
//             status: "001",
//             data: data,
//             TotalAmount: totalAmount
//         });

//         // console.log(data)
//     } catch (error) {
//         console.log(error)
//     }
// }






















const showalladdcard = async (req, res) => {
    try {
        const data = await addtocard.find().lean();
        const newdata = data.map(item => { return item.categoryid }).flat();

        //  item.price - (item.price / 100 * parseInt(item.offer)
        // const newdatafordis = data.map(item => {
        //     const filterprice = item.price - (item.price / 100 * (item.offer));
        //     return { ...item, DiscountedPriceproduct: filterprice };
        // });
        const validIds = newdata.filter(id => mongoose.Types.ObjectId.isValid(id));


        if (validIds.length > 0) {
            const lastdata = await categorymodel.find({ _id: { $in: validIds } });
            const newdatafordis = lastdata.map(item => {
                const quantity = item.quantity;
                const filterprice = item.price - (item.price / 100 * (item.offer))
                const a = {
                    price: filterprice,
                    offer: filterprice * quantity
                };
                return a;
            }
            )
            return res.status(200).json({
                status: "001",
                data: lastdata,
                newdatafordis: newdatafordis
            });
        } else {
            console.log("Product not found.");
            return res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (error) {
        console.log(error)
    }
}

const quantityUpdate = async (req, res) => {
    try {
        const { productId, operation } = req.body; // operation: "increase" or "decrease"

        const product = await categorymodel.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let newQuantity = product.quantity;

        if (operation === "increase") {
            newQuantity += 1;
        } else if (operation === "decrease" && newQuantity > 0) {
            newQuantity -= 1;
        }

        const updatedProduct = await categorymodel.findOneAndUpdate(
            { _id: productId },
            { $set: { quantity: newQuantity } },
            { new: true } // Returns updated document
        );

        res.status(200).json({ data: updatedProduct });

    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred",
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
            return res.status(200).json({
                status: "001",
                data: updatelikes
            })
        }
        else {
            console.log("Product not found.");
            return res.status(404).json({
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
        // const finaldata = await categorymodel.find().lean()
        // const data2 = await finaldata.map(item => {
        //     const newprice = item.price - (item.price / 100 * parseInt(item.offer))
        //     item.DiscountedPrice = newprice 
        // });

        const data = await addtocard.find();
        let sum = 0;

        const price = async () => {
            for (let item of data) {
                const finddata = item.categoryid;
                console.log("finddata : : ", finddata);
                const newdata = await categorymodel.find({ _id: finddata });

                newdata.forEach(item => {
                    const final = item.price - (item.price / 100 * (item.offer));
                    const a = final * item.quantity;
                    sum += a;
                });
            }
            console.log("sum : ", sum);
        };

        await price();
        res.status(200).json({
            status: "001",
            TotalPrice: sum,
        });

    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
};

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
        const { productId } = req.body;
        const userdetails = await usermodel.find({ Email: req.user.Email })
        // const userbyallproduct = await categorymodel.find({ UserId: userdetails[0]._id }).lean();
        const userbyallproduct = await categorymodel.find({ _id: productId }).lean();
        const toalammount = userbyallproduct.map(item => {
            const filterprice = item.price - (item.price / 100 * (item.offer))
            const a = filterprice * item.quantity
            return a;
        })
        // console.log("userbyallproduct",)

        // let totalDiscountedPrice = 0;
        // const data2 = await userbyallproduct.map(item => {
        //     const newprice = item.price - (item.price / 100 * parseInt(item.offer))
        //     item.DiscountedPrice = newprice 
        //     totalDiscountedPrice += newprice;

        //     item.totalDiscountedPrice = totalDiscountedPrice;
        // });
        const userrdata =
            userdetails[0].Address[0].Address + ","
            +
            userdetails[0].Address[0].village + ","
            +
            userdetails[0].Address[0].PinCodeNumber;

        return res.status(200).json({
            userdetails: userdetails,
            userDetails: userrdata,
            totalDiscountedPrice: toalammount
        }) 

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
};


const product_pricefilter = async (req, res) => {
    try {
        const { order } = req.body;

        const allproduct = await categorymodel.find().sort([["price", "asc" ? "desc" : ""]]);
        const allproductprice = allproduct.map(item => item.price);

        return res.status(200).json({ sortedPrices: allproductprice });
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


        return res.status(200).json({
            status: "001",
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
        return res.status(200).json({
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
        return res.status(500).json({ message: 'Internal server error', error: error.message });

    }

}
const profile = async (req, res) => {
    try {

        const data = await usermodel.find({});
        return res.status(200).json({
            status: "00001",
            data: data
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
const productremove = async (req, res) => {
    try {
        const { productid } = req.body;
        const finddata = await categorymodel.findOne({ _id: productid })
        if (finddata) {
            const data = await categorymodel.findOneAndDelete({ _id: productid })
            return res.status(200).json({
                status: "001",
                data: data
            })
        }
        else {
            return res.status(404).json({
                status: "404",
                message: "Product not found"
            });
        }



    } catch (error) {
        console.log(error)
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
    rating,
    showalladdcard,
    productremove
}
