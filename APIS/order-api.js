const express = require('express')
const orderApiObject = express.Router();

const Order = require('../models/order-model')
const errorHandler = require("express-async-handler")

// import validate token middleware
const validateToken = require("./middlewares/verifyToken")

orderApiObject.post('/createorder',errorHandler(async (req, res) => {
    
      const order = new Order(req.body);
     // console.log("Order",order)
      await order.save();
      res.send({ message: "New Order saved" });
  
  }));

  orderApiObject.get('/getorders/:userName',errorHandler(async(req,res)=>{
    let ordersArray = await Order.find({ "orderStatus": true, "userName": req.params.userName })
    res.send({ message: ordersArray })
  }))


  module.exports = orderApiObject;