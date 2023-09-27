const mongoose = require("mongoose");
require("dotenv").config()
//mongodb+srv://sharadparadhi:"+encodeURIComponent("@2124Paradhi")+"@cluster0.yx1ofwp.mongodb.net/fullstack2
const connection = mongoose.connect("mongodb+srv://sharadparadhi:"+encodeURIComponent("@2124Paradhi")+"@cluster0.yx1ofwp.mongodb.net/fullstack2");

module.exports = { connection };