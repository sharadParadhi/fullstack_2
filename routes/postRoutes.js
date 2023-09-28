const express=require("express")
const {PostModel}=require("../models/postModel")
const {auth}=require("../middlewares/auth")

const postRoutes=express.Router()


postRoutes.post("/add",auth,async(req,res)=>{
    console.log("add is work")
    try{
        const newPost= new PostModel(req.body)
        await newPost.save()
        res.status(201).json({"msg":"post added",newPost})

    }catch(err){
        res.status(500).json({"error":err})
    }
})

postRoutes.get("/",auth,async(req,res)=>{
   
    try{
        const { title, page, limit } = req.query;

        // Convert page and limit to numbers, and provide default values
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10; // Default limit to 10 if not provided
      
        const skip = (pageNumber - 1) * limitNumber;
      
       
          let posts;
      
          if (title) {
            posts = await PostModel.find({ title }).skip(skip).limit(limitNumber);
          } else {
            posts = await PostModel.find().skip(skip).limit(limitNumber);
          }

          res.status(200).json({ msg: "All posts", posts });
       
        
    }catch(err){
        res.status(500).json({"err":err})
    }
})

postRoutes.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params;
    try{
        await PostModel.findByIdAndDelete({_id:id})
        const posts=await PostModel .findOne({_id:id});
        res.status(202).json({"msg":`${id} is deleted`,posts})

    }catch(err){
        res.status(500).json({"error":err})
    }
})

postRoutes.delete("/update/:id",auth,async(req,res)=>{
    const {id}=req.params;
    try{
        await PostModel.findByIdAndUpdate({_id:id},req.body)
        const posts=await PostModel .findOne({_id:id});
        res.status(202).json({"msg":`${id} is upadeted`,posts})

    }catch(err){
        res.status(500).json({"error":err})
    }
})


module.exports={postRoutes}