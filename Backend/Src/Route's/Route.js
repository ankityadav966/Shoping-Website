const express = require("express");
const registerapi = require("../Controller/ComanApi/Register");
const validate = require("../Middleware/Validaction");
const Clientloginapi = require("../Middleware/Zodvalidate");
const {catigorydata,allproductget, findbycategory} = require("../Controller/ProductApi/Category");
const {addproduct, quantityUpdate, total, buydata, product_pricefilter, min_max_price, discountwithproduct, favoriteColor, searchapi, profile, likesquintaty, rating, showalladdcard, productremove} = require("../Controller/ProductApi/Addtocard");
const verificationMiddleware = require("../Controller/ComanApi/verifeaction");
const router = express.Router()

router.post('/registerapi',validate(Clientloginapi),registerapi)
router.post("/catigorydata",catigorydata)
router.get("/allproductget",allproductget)
router.get("/findbycategory",findbycategory)
router.post("/addproduct",verificationMiddleware,addproduct)
router.get("/showalladdcard",showalladdcard)
router.put('/quantityUpdate',verificationMiddleware,quantityUpdate)
router.get("/total",total)
router.get("/buydata",verificationMiddleware,buydata)
router.get("/productpricefilter",product_pricefilter)
router.post("/minmaxprice",min_max_price),
router.post("/discountwithproduct",discountwithproduct)
router.post("/favoritecolor",favoriteColor)
router.get("/searchapi",searchapi)
router.get("/profile",profile)
router.post("/likesquintaty",likesquintaty)
router.post("/rating",rating)
router.delete("/productremove",productremove)




module.exports = router