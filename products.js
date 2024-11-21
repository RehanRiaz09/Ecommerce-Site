const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const product = require("../models/product");

router.post("/", async (req, res, next) =>{
    try{
console.log(req.body);
const product = new product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock
});
const result = await product.save();
console.log(result);
res.status(200).json({
    message: "Product create Successfully"
})

    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err,
        })
        
    }
});
module.exports = routes;