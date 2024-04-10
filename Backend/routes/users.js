const router = require("express").Router()
const bcrypt = require("bcrypt")
const { User } = require("../models")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middlewares/verifyToken")

router.get("/", (req, res) => {
    res.json({ msg: "user route" })
})

router.post("/signup", async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.body.password, salt)
    const user = await User.create({
        email: req.body.email,
        password: passwordHash
    })

    const token = jwt.sign({ id: user._id }, process.env.SECREAT_KEY)

    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "nanuthilak0001@gmail.com",
    //         pass: process.env.MAIL_PWD
    //     }
    // })

    // let info = await transporter.sendMail({
    //     from: "Amazon clone <nanuthilak000@gmail.com>",
    //     to: req.body.email,
    //     subject: "user login",
    //     html: `
    //     <div>
    //     <strong>${req.body.email}</strong>, we welcome to out platform, 
    //     <a style="background-color: yellow; color:black;" href="http://localhost:3000/user/verify/${token}">Verify Email</a>
    //     <div style="background-color: gray;">
    //     <img width="300px" height="150px" src="https://cdn.logo.com/hotlink-ok/logo-social.png" />
    //     </div>
    //     <div>
    //     <p>Thanks and regards</p>
    //     <p>Login page</p>
    //     </div>
    //     </div>
    //     `
    // })
    // if (info) {
    //     console.log(info)
    // }
    res.json({ msg: "Account was created successfully, please verify your email" })

})


router.post("/login", async (req, res) => {
    let { email, password } = req.body
    const result = await User.findOne({ email: email })

    if (result) {
        if (result.verified) {
            bcrypt.compare(password, result.password).then((passwordResult) => {
                if (passwordResult) {
                    jwt.sign({ userId: result._id }, process.env.SECREAT_KEY, { expiresIn: "1h" }, (err, token) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            return res.json({
                                success: true,
                                msg: "Login Successful",
                                token
                            })
                        }
                    })
                } else {
                    return res.json({ success: false, msg: "Incorrect password" })
                }
            })
        }
        else {
            return res.json({ success: false, msg: "Please verify your email" })
        }
    }
    else {
        return res.json({ success: false, msg: "User not registered" })
    }

})


router.get("/data", verifyToken, (req, res) => {
   // console.log(req.user);
    return res.json(req.user)
})

router.get("/verify/:token", async (req, res) => {
    const token = jwt.verify(req.params.token, process.env.SECREAT_KEY, async (err, decoded) => {
        if (err) {
            return res.json({ msg: "Link expired", success: false })
        }
        const id = decoded.id
        await User.findByIdAndUpdate(id, { verified: true })
        return res.json({ msg: "Account verified successfully", success: true })
    })

})

module.exports = router