const jwt = require("jsonwebtoken")

function getUser(req, res, next) {
    const token = req.headers["authorization"]

    if (token) {
        jwt.verify(token, process.env.SECREAT_KEY, (error, decodedToken) => {
            if (error) {
                return res.json({ msg: "Access Denied wrong token" })
            } else {
                req.userId = decodedToken.userId
                next()
            }
        })
    }
    else {
        return res.json({ msg: "Access Denied token not found" })
    }


}

module.exports = getUser