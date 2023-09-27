const express = require("express")
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt")
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
require("dotenv").config()


const userRoutes = express.Router()



const isValidPass = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasLength = password.length >= 8

    return hasLength && hasLowerCase && hasUpperCase && hasSymbol
}


userRoutes.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        let check = isValidPass(password)
        if (!isValidPass(password)) {
            console.log(check)
            console.log()
            return res.status(400).json({ "msg": `Password should have Uppercase lowercase and symbol and length shoud be getrer than 8` })
        }

        let userExist = await User.findOne({ email })
        if (userExist) {
            res.status(400).json({ "msg": `${email} is already registered ! please login` })
        } else {
            bcrypt.hash(req.body.password, 10, async (error, hash) => {
                if (error) {
                    res.status(400).json({ "msg": "please type correct password" })
                } else {
                    const newUser = new User({ ...req.body, password: hash })
                    await newUser.save();
                    res.status(201).json({ "msg": `${email} is registerd sucssfully` })
                }
            })
        }

    } catch (err) {
        res.status(500).json({ "msg": `server error ${err}` })
    }
})


userRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        let userExist = await User.findOne({ email })
        console.lo("user",userExist)
        if (userExist) {
            bcrypt.compare(password, userExist.password, (err,result ) => {
                if (result) {
                   
                    const token = jwt.sign({ userID: userExist._id, username: userExist.name }, process.env.SECRETKEY)
                    res.status(200).json({msg:`${userExist.email} login Successfully`})
                }else{
                  
                    res.status(400).json({"msg":`wrong credential`})
                }
            })

        } else {
            res.status(400).json({ "msg": `${email} user is not exist please registerd first!` })
        }

    } catch (err) {

    }
})


userRoutes.get("/",async(req,res)=>{
    try{
        let users=await User.find()
        res.status(200).json({"users":users})

    }catch(err){
        res.status(500).json("erro")
    }
})

module.exports = { userRoutes }