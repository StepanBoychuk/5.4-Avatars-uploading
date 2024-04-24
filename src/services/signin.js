require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./../models/User.js');
const hashPassword = require('./../services/hashPassword.js')

const signin = async (body) => {
    const user = await User.findOne({username: body.username}, "id username password role")
    if (body.username = user.username && await hashPassword(body.password) == user.password) {
        const userData = {
            id: user.id,
            username: user.username,
            role: user.role
        }
        return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: "24h"})
    }
}

module.exports = signin