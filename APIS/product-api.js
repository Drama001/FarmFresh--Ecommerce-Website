//mini express
const exp = require("express")
const productApiObj = exp.Router()

//import express-async-handler
const errorHandler = require("express-async-handler")
const Product = require("../models/product-model")
//import body parser
productApiObj.use(exp.json())
// import validate token middleware
const validateToken = require("./middlewares/verifyToken")
//imports
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")
//configure cloudinary
cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret
});
//configure cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'productPictures',
            public_id: file.fieldname + '-' + Date.now()
        }
    },
});
//configure multer
var upload = multer({ storage: storage })

//create a product
productApiObj.post("/addproduct", validateToken, upload.single('photo'), errorHandler(async (req, res) => {
    //console.log("url path is ",req.file.path); 
    let productObj = JSON.parse(req.body.productObj);
    productObj.productImage = req.file.path;
    //Adding unique Id to the productObj
    productObj.productId = Date.now();
    //console.log("productObj", productObj)
    //search for product in db with productId
    let productObjFromDb = await Product.findOne({ productName: productObj.productName, productBrand: productObj.productBrand, productCategory: productObj.productCategory, status: true })
    //console.log(productObjFromDb);
    //if product doesn't exists
    if (productObjFromDb == null) {
        //create a new object
        let newProductObj = new Product(productObj)
        //console.log(newProductObj)
        //save it 
        await newProductObj.save()
        res.send({ message: "Product added" })
    }
    else {
        res.send({ message: "product already exists" })
    }

}))

//get all products
productApiObj.get("/getproducts", errorHandler(async (req, res) => {
    //get all products from db
    let productsArray = await Product.find({ "status": true })
    res.send({ message: productsArray })
}))

//update all prices (admin)
productApiObj.post('/updateprice', validateToken, errorHandler(async (req, res) => {
    //   console.log(req.body)
    const product = await Product.findOneAndUpdate({ "productId": req.body.productId, "status": true }, { "productPrice": req.body.productPrice }, { returnOriginal: false })

    res.send({ message: "Update Successful", productName: req.body.productName })
})
)

//delete product (admin)
productApiObj.post('/deleteproduct', validateToken, errorHandler(async (req, res) => {
    //console.log(req.body)
    const product = await Product.findOneAndUpdate({ "productId": req.body.productId, }, { "status": false })

    res.send({ message: "Product deleted" })
})
)

//productDetails page || get product by id
productApiObj.get('/getproduct/:id', errorHandler(async (req, res) => {
    const product = await Product.findOne({ 'productId': req.params.id })
    res.send({ product })
}))


//Edit product (admin)
productApiObj.post('/updateproduct', validateToken, errorHandler(async (req, res) => {
    //   console.log(req.body)
    let newDataObj = (req.body)
    //   console.log("recieved data",newDataObj)
    const product = await Product.findOneAndUpdate({ "productId": req.body.productId, "status": true }, { $set: newDataObj }, { new: true })
    // console.log("Product is",product)
    res.send({ message: "Update Successful" })
})
)

//Adding of review of product by User
productApiObj.post('/addproductreview',validateToken, errorHandler(async (req, res) => {

    const reviewObj = await Product.findOne({ "productId": req.body.productId, productReview: { $elemMatch: { userName: req.body.userName } } })

    if (reviewObj == null) {

        const newReview = await Product.findOneAndUpdate({ "productId": req.body.productId },
            { $push: { "productReview": { userName: req.body.userName, productRating: req.body.productRating, productComments: req.body.productComments } } }, { returnOriginal: false, upsert: true, new: true })

        res.send({ message: "Product review submitted" })
        // console.log('reviewObj',cartObj)
    }
    else {
        //console.log(reviewObj)
        for (let review of reviewObj.productReview) {
            if (review.userName == req.body.userName) {
                review.productRating = req.body.productRating;
                review.productComments = req.body.productComments;
            }
        }
        res.send({ message: "Product review updated" })
        await reviewObj.save();
    }
}))

//export
module.exports = productApiObj