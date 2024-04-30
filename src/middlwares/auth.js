require('dotenv').config()
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).send("Unauthorized: Missing token")
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
     if (error) {
      return res.status(401).send("Forbidden: Invalid token")
     }
     req.user = user
     next() 
    })

  }catch (error) {
    res.status(500).send(error.message)
  }
}



module.exports = auth;
