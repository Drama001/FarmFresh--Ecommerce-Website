const express = require('express')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user-model')
const jwt = require("jsonwebtoken")

const userApiObject = express.Router();
const errorHandler = require("express-async-handler")


// import validate token middleware
const validateToken = require("./middlewares/verifyToken")


//in userprofile
userApiObject.get('/getuser/:userName', validateToken, errorHandler(async (req, res) => {
  const user = await userModel.findOne({ 'userName': req.params.userName })
  // console.log(user)
  if (user) {
    res.send({ message: user })
  }
  else {
    res.send({ message: "No user found" })
  }
}))

//update user phone number in usernav-> userprofile component
userApiObject.post('/updateuserdetails', validateToken, errorHandler(async (req, res) => {
  const user = await userModel.findOneAndUpdate({ 'userName': req.body.userName }, { 'phone': req.body.phone })
  res.send({ message: "User phone number updated" })
}))

//check username in register component in login page
userApiObject.post('/checkuser', errorHandler(async (req, res) => {
  const user = await userModel.findOne({ "userName": req.body.userName })
  if (user) {
    res.send({ message: "Username already present" });
  }
  else {
    res.send({ message: "Continue......." })
  }
}))

//check admin in router home component.ts for navigation
userApiObject.post('/checkadminuser', errorHandler(async (req, res) => {
  const user = await userModel.findOne({ "userName": req.body.userName })
  if (user.userTypeAdmin) {
    res.send({ message: "User is Admin" });
  }
  else {
    res.send({ message: "Not Admin" })
  }
}))

//In register page to create new user
userApiObject.post('/createuser', errorHandler(async (req, res) => {
  // const prevData = await userModel.findOne({ "Id": (req.body.Id * 1) })
  const prevData = await userModel.findOne({ "userName": req.body.userName })
  if (!prevData) {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = new userModel(req.body);
    await user.save();
    res.send({ message: "New User Added" });
  }
  else {
    res.status(200).send({ message: "User Id already exists" })
  }
}));

//In login page MAIN ROUTE
userApiObject.post("/login", errorHandler(async (req, res) => {

  let userData = await userModel.findOne({ userName: req.body.userName })
  // console.log("req.body.userName")
  if (req.body.userName == "") {
    res.send({ message: "Please enter Username" })
  }
  if (!userData) {
    res.send({ message: "Username not found" })
  }

  let value = await bcrypt.compare(req.body.password, userData.password)

  if (value) {
    let signedToken = await jwt.sign({ userName: req.body.userName }, process.env.SECRET, { expiresIn: 15000 })
    res.send({ message: "login successful", token: signedToken, userName: req.body.userName, userTypeAdmin: userData.userTypeAdmin })
  }
  else {
    res.send({ message: "Invalid password" })
  }
}))

//Add to cart functionality in products page and cart
userApiObject.post('/addtocart', validateToken, errorHandler(async (req, res) => {

  const cartObj = await userModel.findOne({ "userName": req.body.userName, cart: { $elemMatch: { productId: req.body.productId } } })
  if (cartObj) {
    for (let cartItem of cartObj.cart) {
      if (cartItem.productId == req.body.productId) {
        cartItem.quantity++;
      }
    }
    // console.log('cartObj',cartObj)
    res.send({ message: "Product quantity updated" })
    await cartObj.save();
  }
  else {
    const newItem = await userModel.findOneAndUpdate({ "userName": req.body.userName },
      { $push: { "cart": { productId: req.body.productId } } }, { returnOriginal: false, upsert: true, new: true })

    res.send({ message: "Product added to the cart Successful" })
  }
}))

//read cart in Cart componentt
userApiObject.get('/getcart/:userName', validateToken, errorHandler(async (req, res) => {

  const user = await userModel.findOne({ 'userName': req.params.userName })
  res.send({ message: user.cart })
}))

//reduce number in cart component
userApiObject.post('/removequantity/:userName/:id', validateToken, errorHandler(async (req, res) => {

  const cartObj = await userModel.findOne({ "userName": req.params.userName, cart: { $elemMatch: { productId: req.params.id } } })

  if (cartObj.cart) {
    for (let x of cartObj.cart) {
      if (x.productId == req.params.id) {
        x.quantity--;
        if (x.quantity < 1) {
          const newItem = await userModel.findOneAndUpdate({ "userName": req.params.userName },
            { $pull: { 'cart': { productId: req.params.id } } }, { returnOriginal: false, upsert: true, new: true })

          res.send({ message: "Product deleted from the cart Successful" })
        }
      }
    }
    // console.log('cartObj',cartObj)
    res.send({ message: "Reduced Quantity" })
    await cartObj.save();
  }
}))

//Completely remove cart item from the cart in the cart component
userApiObject.post('/removecartitem/:userName/:id', validateToken, errorHandler(async (req, res) => {

  const findItem = await userModel.findOneAndUpdate({ "userName": req.params.userName },
    { $pull: { 'cart': { productId: req.params.id } } }, { returnOriginal: false, upsert: true, new: true })
  // console.log(findItem);
  res.send({ message: "Product deleted from the cart Successful" })
}))

//getting the length of the cart
userApiObject.get('/getcount/:userName', errorHandler(async (req, res) => {
  let count = 0;
  const cartObj = await userModel.findOne({ "userName": req.params.userName })
  for (let x of cartObj.cart) {
    count += x.quantity;
  }
  res.send({ message: count })
}))

//After payment of the order
userApiObject.post('/resetcart/:userName',errorHandler(async(req,res)=>{
  const newItem = await userModel.findOneAndUpdate({ "userName": req.params.userName },
  { $set: { "cart":  [] }}, { multi:true })
  
  res.send({ message: "user cart got reset" })

}))

//password changing
userApiObject.post('/changepassword/:userName',validateToken,errorHandler(async(req,res)=>{

  const userObj = await userModel.findOne({ "userName": req.params.userName })

  if(!req.body.currentpwd) {
    res.send({message:"currentpwd is missing"})
  }
  else if (!req.body.newpwd) {
    res.send({message:"newpwd is missing"})
  }
  else if (req.body.newpwd != req.body.newpwd2){
    res.send({message:"not matching"})
  }
  else {
    let value = await bcrypt.compare(req.body.currentpwd, userObj.password)
    if (value) {
      let hashedPassword = await bcrypt.hash(req.body.newpwd, 10);
      userObj.password = hashedPassword;
      await userObj.save();
      res.send({ message: "Passsword updated succesfully" });
    }
    else {
      res.send({ message: "Invalid password" })
    }
  }
}))

module.exports = userApiObject;