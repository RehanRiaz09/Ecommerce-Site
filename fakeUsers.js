const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose")
const { faker } = require ('@faker-js/faker');
const FakeUser = require("../models/fakeUser");


routes.get("/user", async (req, res) => {
    try {
        const fakeUsers = [];
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

        // Store fake users in the database
        // const result = await FakeUser.insertMany(fakeUsers); // Ensure FakeUser is a valid model
        // res.status(201).json({
        //     message: "Fake users created successfully",
        //     createdFakeUsers: result,
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
        });
    }
});

routes.get("/fakeuser", async (req, res) => {
    try {
        const page = parseInt(req.query.p) || 1;
        const limit = 10;
        const skip = (page - 1) * limit; 
        
        const totalUsers = await FakeUser.countDocuments();

    
        const users = await FakeUser.find().skip(skip).limit(limit);

        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            message: "Fake users retrieved successfully",
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: limit,
            totalUsers: totalUsers,
            users: users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
        });
    }
});

routes.get("/finduser", async(req, res, next)=>{
    try{
        const docs = await FakeUser.find({ 
            email: { $regex: /@(gmail|hotmail)\.com$/i } 
        }).select("username email password")
res.status(200).json({
    count: docs.length,
    fakeUsers: docs,
  });
    }catch(err){
        console.log(error);
        res.status(500).json({
            error: err
        })
        
    }
})
// routes.delete("/bulk-delete", async (req, res, next) => {
//     try {
//         const userIds = req.body.userIds; // Expecting an array of 50 user IDs in the request body

//         if (!Array.isArray(userIds) || userIds.length !== 50) {
//             return res.status(400).json({ 
//                 message: "Please provide exactly 50 user IDs in an array." 
//             });
//         }

//         // Perform bulk delete operation
//         const result = await User.deleteMany({ _id: { $in: userIds } });

//         res.status(200).json({
//             message: "50 users deleted successfully",
//             deletedCount: result.deletedCount,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });


module.exports = routes;
