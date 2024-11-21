const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const productRouter = require("./routes/products")
const categoryRouter = require("./routes/categories")
const orderRouter = require("./routes/orders")
const userRouter = require("./routes/users")
const fakerRouter = require("./routes/faker")
mongoose.connect("mongodb://127.0.0.1:27017/Eshopdbldb");
mongoose.Promise = global.Promise;


app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/product", productRouter)
app.use("/category", categoryRouter)
app.use("/order", orderRouter)
app.use("/user", userRouter)
app.use("/faker", fakerRouter)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
  
  module.exports = app;