const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const categorymodel = require("../../Model's/Category");

const app = express();


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

const catigorydata = async (req, res) => {
    try {
        upload.array("images", 10)(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }

            const { UserId, Product_Name, price, likes, rating, offer, quantity, Color, description, alt,prooduct_category } = req.body;


            const imageUrls = req.files.map(file => ({
                url: file.path,
                alt: alt || "This One Image"
            }));

            const newCategory = await categorymodel.create({
                UserId,
                Product_Name,
                images: imageUrls,
                Color,
                price,
                description: JSON.parse(description),
                likes,
                rating,
                offer,
                quantity,
                prooduct_category
            });

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: newCategory,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message,
        });
    }
};
const allproductget = async (req, res) => {
    try {
        // const data = await categorymodel.find();
        const finaldata = await categorymodel.find().lean()
        const data2 = await finaldata.map(item => { 
            const newprice = item.price - (item.price / 100 * parseInt(item.offer))
            item.DiscountedPrice = newprice 
        });
        finaldata.price = finaldata.offer * finaldata.quantity


        res.status(200).json({
            data: '001',
            All_Priduct: finaldata
        })
    } catch (error) {
        console.log(error)
    }
}

const findbycategory = async(req,res)=>{
    try{
        const {prooduct_category} = req.body;

        const data = await categorymodel.find({ prooduct_category: prooduct_category });
        const count = await categorymodel.countDocuments({ prooduct_category: prooduct_category });
        

        res.status(200).json({
            data:data,
            productCount:count
        })
    }catch(error){
        console.log(error)
    }
}


module.exports = {
    catigorydata,
    allproductget,
    findbycategory

}
