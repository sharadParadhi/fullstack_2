const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
    image:String,
    title:String,
    author:String,
    userID:String,
    username:String,
})

const PostModel=mongoose.model("posts",postSchema)

module.exports={PostModel}