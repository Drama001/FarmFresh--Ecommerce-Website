const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userName: String,
    dateNow: Number,
    products: [{
        productId: Number,
        productName: String,
        productPrice: Number,
        productBrand: String,
        productCategory: String,
        productDescription: String,
        productImage: String,
        quantity: Number,
    }],
    total:Number,
    orderStatus: {
        type: Boolean,
        default: false
    },

    address: {
        firstName: String,
        lastName: String,
        email: String,
        address1: String,
        address2: String,
        City: String,
        State: String,
        Zip: String
    }

})

const Order = mongoose.model('order', OrderSchema)

module.exports = Order;