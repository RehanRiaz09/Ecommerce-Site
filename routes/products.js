const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const multer = require("multer")
const Product = require("../models/product");
const product = require("../models/product");



const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

// Multer upload options
const uploadOptions = multer({ storage: storage });

// Route to handle product creation
routes.post("/", uploadOptions.single('image'), async (req, res, next) => {
  try {
    // Validate if the file exists
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided or invalid image type'
      });
    }

    const fileName = req.file.filename; // Use `req.file.filename` for uploaded file
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    // Create new product
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      image: `${basePath}${fileName}`, // Path to the uploaded image
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      countInStock: req.body.countInStock,
      numReviews: req.body.numReviews,
      isFeature: req.body.isFeature,
      dateCreate: req.body.dateCreate,
    });

    // Save product to the database
    const result = await product.save();
    res.status(200).json({
      message: "Product created successfully",
      product: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});
routes.get("/" , async(req, res, next) =>{
try{
const docs = await Product.find().populate("category").select("name description image brand price category rating countInStock numReviews isFeature dateCreate")

res.status(200).json({
  count: docs.length,
  product:docs,
})
}catch(err){
  console.error(err);
  res.status(500).json({
    error: err.message || "Internal Server Error"
  })
  
}
});
routes.get("/:productId", async(req, res, next)=>{
  {
    try {
      const id = req.params.productId;
      const doc = await Product.findById(id)
        .populate("category")
        .select("name description image brand price category rating countInStock numReviews isFeature dateCreate");
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provide ID" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
});
routes.patch("/:productId", async(req, res, next) =>{
  try{
const id = req.params.productId;
const doc = await Product.findOneAndUpdate({_id: id},
  {
    $set:{
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      countInStock: req.body.countInStock,
      numReviews: req.body.numReviews,
      isFeature: req.body.isFeature,
      dateCreate: req.body.dateCreate,
    },
  },
)
res.status(200).json({
  message: "Product update",
})
  }catch(err){
    console.log(err);
    res.status(500).json({
      error:err,
    })
    
  }
});
routes.delete("/:productId", async(req, res, next) =>{
try{
const id = req.params.productId;
const result = await Product.deleteOne({_id: id});
res.status(200).json({
  message: "Product deleted sucessfully"
})
}catch(err){
  console.log(err);
  res.status(500).json({
    error:err,
  });
  
}
});
routes.put(
  '/gallery-images/:id', 
  uploadOptions.array('images', 10), 
  async (req, res)=> {
      if(!mongoose.isValidObjectId(req.params.id)) {
          return res.status(400).send('Invalid Product Id')
       }
       const files = req.files
       let imagesPaths = [];
       const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

       if(files) {
          files.map(file =>{
              imagesPaths.push(`${basePath}${file.filename}`);
          })
       }

       const product = await Product.findByIdAndUpdate(
          req.params.id,
          {
              images: imagesPaths
          },
          { new: true}
      )

      if(!product)
          return res.status(500).send('the gallery cannot be updated!')

      res.send(product);
  }
)
module.exports = routes;