const mongoose = require("mongoose")
const colors= require("colors")
//i donno .env does not work here why?
const MONGO_URI="mongodb+srv://rakib047:Rakib22422m@merndb.nlsauhz.mongodb.net/FoodBear?retryWrites=true&w=majority"

const mongoDB = async() =>{
    await mongoose.connect(MONGO_URI,{ useNewUrlParser: true })
    console.log(`Connected to MONGODB`.cyan.bold.italic)
}

module.exports = mongoDB