const express = require("express");
const routes = express.Router();
const { faker } = require('@faker-js/faker');

routes.get("/user", (req, res, next) => {
    const users = []; // Initialize an array to store users

    // Loop to generate 50 fake user objects
    for (let i = 0; i < 50; i++) {
        users.push({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            password: faker.internet.password(),
            birthdate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            registeredAt: faker.date.past()
        });
    }

    // Send the array of fake users as the response
    res.json(users);
});

module.exports = routes;
