const express = require("express")
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt")
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../models/blackListModel");
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


userRoutes.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
       let user=await User.findOne({email})
       if(user){
        bcrypt.compare(password,user.password,(error,decoded)=>{
            if(decoded){
                let token=jwt.sign({userID:user._id,username:user.name},process.env.SECRETKEY,{expiresIn:'1h'})
                res.status(200).json({"msg":`${email} logged successfully`,token})
            }else{

                res.status(400).json({"error":"invalid credential"})
            }
        })
       }else{
        res.status(400).json({"error":`${email} does not exist!`})
       }
    }catch(err){
        res.status(500).json({"error":err})
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


userRoutes.get("/logout",async(req,res)=>{
    try{
        const token=req.headers.authorization?.split(" ")[1] || null;
        token && (await BlackListModel.updateMany({},{$push:{blacklist:[token]}}))
       
       //await BlackListModel.push(token)
        
            return res.status(200).json({"msg":"user logout sucessfully"})
        

        

    }catch(err){
        res.status(500).json({"error":err})
    }
})

module.exports = { userRoutes }