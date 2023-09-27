const mongoose=require("mongoose")



const userSchema=mongoose.Schema({
    name:String,
    profile:String,
    email:String,
    password:String,
    
})

const User=mongoose.model("users",userSchema)

module.exports={User}