const fs=require("fs")

const logger=(req,res,next)=>{
    const log=`URL: ${req.url} Method: ${req.method},TimeStamp: ${Date()}\n`
    fs.appendFileSync("logs.txt",log)
    next()
}


module.exports={logger}