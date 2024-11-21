const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/category");
const category = require("../models/category");

routes.post("/", async (req, res, next) =>{
    try {
        console.log(req.body);
        const category = new Category({
          name: req.body.name,
          icon: req.body.icon,
          color: req.body.color,
          
        });
        const result = await category.save();
        console.log(result);
        res.status(200).json({
          message: "Create category successfully",
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      }
});
routes.get("/" , async(req, res, next) =>{
  try{
  const docs = await Category.find().select("name icon color");
  res.status(200).json({
    count: docs.length,
    category:docs,
  })
  }catch(err){
    console.error(err);
    res.status(500).json({
      error: err.message || "Internal Server Error"
    })
    
  }
  });
  routes.get("/:categoryId", async (req, res, next)=>{
    try {
      const id = req.params.categoryId;
      const doc = await Category.findById(id)
        .select("name icon color");
      console.log(doc);
      if (doc) {
        res.status(200).json({
          category: doc,
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for this provide ID",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  });
  routes.patch("/:categoryId", async(req, res, next) =>{
    try{
  const id = req.params.categoryId;
  const doc = await Category.findOneAndUpdate({_id: id},
    {
      $set:{
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
    },
  )
  res.status(200).json({
    message: "Category update",
  })
    }catch(err){
      console.log(err);
      res.status(500).json({
        error:err,
      })
      
    }
  });
  routes.delete("/:categoryId", async(req, res, next) =>{
    try{
    const id = req.params.categoryId;
    const result = await Category.deleteOne({_id: id});
    res.status(200).json({
      message: "Category deleted sucessfully"
    })
    }catch(err){
      console.log(err);
      res.status(500).json({
        error:err,
      });
      
    }
    });
module.exports = routes;