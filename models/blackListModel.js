const mongoose=require("mongoose")

const blacklistShema= mongoose.Schema({
    blacklist:{type:[String]}
},
{
    versionKey:false
})


const BlackListModel=mongoose.model("blacklist",blacklistShema)


module.exports={BlackListModel}