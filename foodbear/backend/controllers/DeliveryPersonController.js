const DeliveryPersonModel = require("../models/DeliveryPersonModel");
const UserModel= require("../models/UserModel")
const RestaurantModel = require("../models/RestaurantModel")
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwtSecret =
  "EverythinginthisworldisChaoticthereisnomeaningofLifewehavetojustcreateit";

const signupDeliveryPerson = async (req, res) => {
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

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newDeliveryPerson = await DeliveryPersonModel.create({
      name: req.body.name,
      location: req.body.location,
      email: req.body.email,
      password: hashedPassword,
      contact: req.body.contact,
      latitude: req.body.latitude, // Add latitude
      longitude: req.body.longitude, // Add longitude
    });
    res.status(200).json(newDeliveryPerson);
  } catch (error) {
    console.log("error creating new delivery person");
    res.status(400).json({ message: "Not registered!" });
  }
};

const loginDeliveryPerson = async (req, res) => {
  try {
    const fetchedData = await DeliveryPersonModel.findOne({
      email: req.body.email,
    });
    if (!fetchedData) {
      console.log("dPerson nai");
      return res
        .status(404)
        .json({ errors: [{ message: "Email doesn't exist!" }] });
    }
    const salt = await fetchedData.salt;
    const isMatched = await bcrypt.compare(
      req.body.password,
      fetchedData.password,
      salt
    );

    if (!isMatched) {
      return ers
        .status(400)
        .json({ errors: [{ message: "Enter valid credentials!" }] });
    }

    const data = {
      user: {
        id: fetchedData._id,
      },
    };

    const authToken = jwt.sign(data, jwtSecret);
    return res.json({
      success: true,
      authToken: fetchedData._id
    });
  } catch (error) {
    console.log("login error in delivery person");
    return res.json({ success: false });
  }
};

const dashboardDeliveryPerson = async (req,res) =>{
  try {

    const fetchedCollection=await mongoose.connection.db.collection("delivery_persons")
    //sending all delivery persons
    const delivery_persons=await fetchedCollection.find({}).toArray()

    res.send(delivery_persons)
    
  } catch (error) {
    console.log(error)
    return res.status(404).json({success:false})
  }
}

const isAvailableDeliveryPerson = async (req,res) =>{
  var {deliverypersonId} = req.params
  deliverypersonId=deliverypersonId.trim()

  try {
    const deliveryperson = await DeliveryPersonModel.findById(deliverypersonId)
    //console.log("here")

    if(!deliveryperson){
      return res.status(404).json({message:"delivery person not found"})
    }

    deliveryperson.is_available= !deliveryperson.is_available
    console.log(deliveryperson.is_available)

    //saving to database
    await deliveryperson.save()

    return res.status(200).json({message:"is_available status updated!",is_available:deliveryperson.is_available})

  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"Server problem vai!"})
  }
} 

const updateLocationDeliveryPerson = async (req, res) => {
  const { dpId } = req.params;
  const { location,latitude, longitude } = req.body;

  try {
    const deliveryPerson = await DeliveryPersonModel.findById(dpId);

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }
    console.log(location,latitude,longitude)
    deliveryPerson.location=location
    deliveryPerson.latitude = latitude;
    deliveryPerson.longitude = longitude;

    await deliveryPerson.save();

    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  signupDeliveryPerson,
  loginDeliveryPerson,
  dashboardDeliveryPerson,
  isAvailableDeliveryPerson,
  updateLocationDeliveryPerson
};
