const mongoose = require("mongoose");
const OrderModel= require("../models/OrderModel")
const FoodModel= require("../models/FoodModel")
const OfferFoodCategoryModel = require("../models/OfferFoodCatagory")

const getFoods = async(req,res)=>{
    const foodId = req.params.foodId;
    try {
      //database theke data fetch kortesi
      const food = await FoodModel.findById(foodId);
  
      //backend theke frontend e data pathaitesi
      res.send(food);
    } catch (error) {
      console.log(error);
      return res.json({ success: false });
    }
}

const placeUserOrder = async(req,res)=>{
  received_food_items= []
  for(let i = 0; i < req.body.food_items.length; i++){
    received_food_items.push({
      food_id: req.body.food_items[i].id,
      quantity: req.body.food_items[i].quantity
    })
  }
  try {
    const temp= await OrderModel.create({
      user_id: req.body.user_id,
      restaurant_id: req.body.restaurant_id,
      food_items: received_food_items,
      total_price: req.body.total_price,
      payment_method: req.body.payment_method,
      selectedTime: req.body.selectedTime,
      selectedDay: req.body.selectedDay
    });
    //console.log("in temp",temp)
    res.json({ message: "New order placed!" });
  } catch (error) {
    console.log(error);
    res.json({ message: "order not placed!" });
  }
}

const getAllOrderedFoods = async(req,res)=>{
  try {
    //database theke data fetch kortesi
    const fetched_data = await mongoose.connection.db.collection("foods");
    const foods = await fetched_data.find({}).toArray();

    //backend theke frontend e data pathaitesi
    res.send(foods);
  } catch (error) {
    console.log(error); 
    return res.json({ success: false });
  }
}

const getUserOrder = async(req,res)=>{
  const userId = req.params.userId;
  try {
    // Find all orders for the specified userId
    const orders = await OrderModel.find({ user_id: userId });

    if (!orders) {
      return res
        .json({ message: "No orders found for this user." });
    }

    // Send the orders as a response
    //console.log(orders)
    res.send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const acceptOrder = async(req,res)=>{
  try {
    const orderId = req.params.orderId;
    const deliverypersonId = req.params.deliverypersonId;
    const confirmedOrder = await OrderModel.findByIdAndUpdate(orderId, {
      status: "confirmed",
      delivery_person_id: deliverypersonId,
    });

    if (!confirmedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "order confirmed" });
  } catch (error) {
    console.error("Error confirming order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const rejectOrder = async(req,res)=>{
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getSpecificRestaurantOrder = async(req,res)=>{
  const restaurantId = req.params.restaurantId;
  try {
    // Find all orders for the specified restaurantId
    const orders = await OrderModel.find({ restaurant_id: restaurantId });

    if (!orders) {
      return res
        .json({ message: "No orders found for this restaurant." });
    }

    // Send the orders as a response
    res.send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getAllOrderofSpecificDpPerson = async (req, res) => {
  const deliverypersonId = req.params.deliverypersonId;
  try {
    // Find all orders for the specified deliverypersonId
    const orders = await OrderModel.find({ delivery_person_id: deliverypersonId });

    // Check if no orders found
    if (!orders || orders.length === 0) {
      // Return an empty array
      return res.json([]);
    }

    // Send the orders as a response
    res.send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const handlePickupOrder = async(req,res)=>{
  try {
    const orderId = req.params.orderId;
    const pickedupOrder = await OrderModel.findByIdAndUpdate(orderId, {
      status: "picked_up",
    });

    if (!pickedupOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "order status changed: picked_up" });
  } catch (error) {
    console.error("Error changing order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const deliverOrder = async(req,res)=>{
  try {
    const orderId = req.params.orderId;
    const deliveredOrder = await OrderModel.findByIdAndUpdate(orderId, {
      status: "delivered",
    });

    if (!deliveredOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "order status changed: delivered" });
  } catch (error) {
    console.error("Error changing order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//this should not be here,but i had to keep it here as it was not working in the restaurant route
const findCatagory = async(req,res)=>{
  
  try {
    const foodCategory = await OfferFoodCategoryModel.find({});
    res.status(200).json(foodCategory);
  }
  catch (error) {
    console.log("error in getting food category");
    res.json({ message: "food category not found!" });
  }
}

const getAllOrders = async(req,res)=>{
  try {
    // Find all orders
    const orders = await OrderModel.find({});

    if (!orders) {
      return res
        .json({ message: "No orders found." });
    }

    // Send the orders as a response
    res.send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

const getFoodForHomeKitchen = async (req, res) => {
  try {
    //console.log(req.params.foodId);
    const food = await FoodModel.findById(req.params.foodId);
    //console.log(food);
    res.status(200).json(food);
  } catch (error) {
    console.log("error in getting food");
    res.json({ message: "food not found!" });
  }
}



module.exports={
    getFoods,
    placeUserOrder,
    getAllOrderedFoods,
    getUserOrder,
    rejectOrder,
    acceptOrder,
    getSpecificRestaurantOrder,
    getAllOrderofSpecificDpPerson,
    handlePickupOrder,
    deliverOrder,
    findCatagory,
    getAllOrders,
    getFoodForHomeKitchen,
}