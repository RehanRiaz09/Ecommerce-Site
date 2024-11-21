const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Get all users
routes.get("/", async (req, res) => {
    try {
        const userList = await User.find().select("name email -passwordHash");
        if (!userList) {
            return res.status(500).json({ success: false });
        }
        res.send(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user by ID
routes.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name email passwordHash");
        if (!user) {
            return res.status(404).json({ message: "The user with the given ID was not found." });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new user
routes.post("/", async (req, res) => {
    try {
      console.log(req.body);
  
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        // passwordHash: req.body.passwordHash,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      });
  
      const savedUser = await user.save();
  
      console.log(savedUser);
  
      res.status(201).json({
        message: "User created successfully",
        user: savedUser,
      });
    } catch (err) {
      console.error(err);
  
      res.status(500).json({
        message: "An error occurred while creating the user",
        error: err.message,
      });
    }
  });

// Update user
routes.put("/:id", async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) {
            return res.status(404).send("User not found!");
        }

        const newPassword = req.body.password
            ? bcrypt.hashSync(req.body.password, 10)
            : userExist.passwordHash;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).send("The user cannot be updated!");
        }

        res.send(updatedUser);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User login
routes.post("/login", async (req, res) => {
    const secret = process.env.secret;
    if (!secret) {
        return res.status(500).send("Secret key is not defined in environment variables!");
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User not found!");
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin,
                },
                secret,
                { expiresIn: "1d" }
            );

            return res.status(200).send({ user: user.email, token });
        } else {
            return res.status(400).send("Password is incorrect!");
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Register user
routes.post("/register", async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        });

        const savedUser = await user.save();
        if (!savedUser) {
            return res.status(400).send("The user cannot be created!");
        }

        res.send(savedUser);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete user
routes.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
        res.status(200).json({ success: true, message: "The user is deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user count
routes.get("/get/count", async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.send({ userCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = routes;
