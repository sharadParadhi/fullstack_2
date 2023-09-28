const jwt=require("jsonwebtoken")
const {blackListModel, BlackListModel}=require("../models/blackListModel")
require("dotenv").config()


 const auth=async(req,res,next)=>{
    try{
        let token=req.headers.authorization?.split(" ")[1] ||null;
        if(token){
            let existToken=await BlackListModel.find({blacklist:{$in:token}})
            if(existToken.length){
                return res.status(400).send({error:"please login again"})
            }
            let decoded=jwt.verify(token,process.env.SECRETKEY)
            console.log("deconded",decoded)
            req.body.userID=decoded.userID;
            req.body.username=decoded.username
          

            next()
        }else{
            res.status(400).json({"error":"Access Denied Please Login first"})
        }

    }catch(err){
        res.status(500).json({"error":err})
    }

 }

 module.exports={auth}