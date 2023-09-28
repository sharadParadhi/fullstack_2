const express=require("express");
require("dotenv").config()
const port=process.env.PORT || 8000;
const {connection}=require("./config/db")
const{userRoutes}=require("./routes/userRoutes")
const{postRoutes}=require("./routes/postRoutes")
const cors=require("cors");
const { logger } = require("./middlewares/logger");

const app=express()
app.use(logger)
app.use(express.json())
app.use("/users",userRoutes)
app.use("/posts",postRoutes)
app.use(cors())

app.get("/",async(req,res)=>{
    try{
        res.send("endpoint of api")
        
    }catch(err){
        res.send("error")
    }

})

app.listen(port,async()=>{
    try{
        await connection;
        console.log("db is connetct at port",port)
    }catch(err){
        console.log("error",err)
    }
})