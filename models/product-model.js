const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    productId: Number,
    productName: String,
    productPrice: Number,
    productBrand: String,
    productCategory: String,
    productDescription: String,
    productImage: String,
    status: {
        type: Boolean,
        default: true
    },
    productReview: [{
        userName: String,
        productRating: Number,
        productComments: String

    }
    ]
})

const Product = mongoose.model('product', ProductSchema)

module.exports = Product;