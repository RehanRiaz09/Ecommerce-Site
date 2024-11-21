const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose")
const { faker } = require('@faker-js/faker');
const fakeUser = require("../models/fakeUser")

routes.get("/user", async (req, res, next) => {
    const fakeUsers = []; // Initialize an array to store users
  
    // Generate 50 fake user objects
    for (let i = 0; i < 50; i++) {
        fakeUsers.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
        registeredAt: faker.date.past(),
      });
    }
    try {
        console.log(req.body);    
        const result = await fakeUser.insertMany(fakeUsers); // save the fake user in db
        console.log(result);
        res.status(201).json({
          message: "Create fakeUsers sucessfully",
          createdfakeUsers: result,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
  });
  
module.exports = routes;
