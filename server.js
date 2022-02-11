const express = require("express")
const app = express();
const bodyparser = require("body-parser")
const path = require("path")
require("dotenv").config();

const mongoose =require("mongoose")
mongoose.connect(process.env.dburl,{useNewUrlParser:true, useUnifiedTopology:true , useFindAndModify: false })
const db = mongoose.connection;


app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(express.static(path.join(__dirname , "/dist/FarmFreshApp")))

const productApiObj = require("./APIS/product-api")
const userApiObject = require("./APIS/user-api")
const orderApiObject = require("./APIS/order-api")

app.use("/user",userApiObject)
app.use("/product",productApiObj)
app.use("/order",orderApiObject)

db.on('error',()=>console.log("Error connecting to Database"))
db.once("open",()=>console.log("Connected to Database"))


const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log("The server started on port "+port)
})
