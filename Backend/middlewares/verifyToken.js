const jwt = require("jsonwebtoken")
const { User } = require("../models/index.js")

function verifyToken(req, res, next) {
    const token = req.headers["authorization"]
    if (token) {
        jwt.verify(token, process.env.SECREAT_KEY, async (err, decodedToken) => {
            if (err) {
                return res.json({ message: "Access denied wrong token" })
            }
            else {
                const data = await User.findById(decodedToken.userId).select("-__v -password")
                if (data) {
                    req.user = data
                    next()
                }
                else {
                    return res.json({ message: "Access denied" })
                }
            }
        })
    }
    else {
        return res.json({ message: "Access denied token not found" })

    }
}


module.exports = verifyToken