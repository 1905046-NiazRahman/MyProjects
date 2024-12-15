const UserModel= require("../models/UserModel")
const RestaurantModel=require("../models/RestaurantModel")
const DeliveryPersonModel=require("../models/DeliveryPersonModel")

const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
const jwtSecret="EverythinginthisworldisChaoticthereisnomeaningofLifewehavetojustcreateit"

const signupUser = async (req,res) =>{
    try {
        const user=await UserModel.findOne(
            {
                email:req.body.email
            }
        )
        const deliveryperson=await DeliveryPersonModel.findOne(
            {
                email:req.body.email
            }
        )
        const restaurant=await RestaurantModel.findOne(
            {
                email:req.body.email
            }
        )
    
        if(user||restaurant||deliveryperson){
            return res.status(400).json(
                {
                    errors: [{message: "Email Already exists!"}]
                }
            )
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)

        const newUser=await UserModel.create(
            {
                name: req.body.name,
                location: req.body.location,
                email : req.body.email,
                contact: req.body.contact,
                password: hashedPassword,
                latitude: req.body.latitude, // Add latitude
                longitude: req.body.longitude, // Add longitude
            }
        )
        console.log(newUser.latitude+" "+newUser.longitude+" :user")
        res.status(200).json(newUser)
    } catch (error) {
        console.log("User signing up failed")
        res.json({message:"User not created"})
    }
}

const loginUser = async (req,res) =>{
    try {
        const fetchedData=await UserModel.findOne(
            {
                email: req.body.email
            }
        )
        
        if(!fetchedData){
            return res.status(404).json({ errors: [{ message: "Email doesn't exist!" }]});
        }

        const salt=await fetchedData.salt
        const isMatched=await bcrypt.compare(req.body.password,fetchedData.password,salt)
        
        if(!isMatched){
            
            return res.json({success:false });
        }

        const data = {
            user : {
                id:fetchedData._id
            }
        }
        const authToken=jwt.sign(data,jwtSecret)

        return res.json(
            {
                success:true,
                authToken:authToken,
                userId:fetchedData._id,
                userName: fetchedData.name
            }
        )
    } catch (error) {
        console.log("error when logging as user")
        res.status(500).json({message:"error while loggin as user"})
    }
}

module.exports= {
    loginUser,
    signupUser
}