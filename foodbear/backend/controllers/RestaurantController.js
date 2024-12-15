const RestaurantModel = require("../models/RestaurantModel");
const FoodCategoryModel = require("../models/FoodCatagoryModel");
const FoodModel = require("../models/FoodModel");
const UserModel = require("../models/UserModel");
const DeliveryPersonModel = require("../models/DeliveryPersonModel");
const OfferedFoodModel = require("../models/OfferedFoodModel");
const OfferFoodCategoryModel = require("../models/OfferFoodCatagory");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OrderModel = require("../models/OrderModel");
const jwtSecret =
  "EverythinginthisworldisChaoticthereisnomeaningofLifewehavetojustcreateit";

const signupRestaurant = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    const deliveryperson = await DeliveryPersonModel.findOne({
      email: req.body.email,
    });
    const restaurant = await RestaurantModel.findOne({
      email: req.body.email,
    });

    if (user || restaurant || deliveryperson) {
      return res.status(400).json({
        errors: [{ message: "Email Already exists!" }],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newRestaurant = await RestaurantModel.create({
      name: req.body.name,
      location: req.body.location,
      email: req.body.email,
      password: hashedPassword,
      contact: req.body.contact,
      is_homekitchen: req.body.is_homekitchen,
      img: req.body.img,
      latitude: req.body.latitude, // Add latitude
      longitude: req.body.longitude, // Add longitude
    });
    console.log(req.body.latitude+" "+req.body.longitude)
    res.status(200).json(newRestaurant);
  } catch (error) {
    console.log("error in signing up restu");
    res.json({ message: "restu sign up error!" });
  }
};

const loginRestaurant = async (req, res) => {
  try {
    const fetchedData = await RestaurantModel.findOne({
      email: req.body.email,
    });
    if (!fetchedData) {
      return res
        .status(400)
        .json({ errors: [{ message: "Email doesn't exist!" }] });
    }

    const salt = fetchedData.salt;
    const isMatched = await bcrypt.compare(
      req.body.password,
      fetchedData.password,
      salt
    );

    if (!isMatched) {
      return res.json({
        success: false,
      });
    }

    const data = {
      user: {
        id: fetchedData._id,
      },
    };

    const authToken = jwt.sign(data, jwtSecret);
    return res.json({
      success: true,
      authToken: authToken,
      restaurant_id: fetchedData._id,
    });
  } catch (error) {
    console.log("restaurant login failed");
    return res.json({
      success: false,
    });
  }
};

const showDashboard = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find({});

    res.status(200).send(restaurants);
  } catch (err) {
    console.log("error getting dashboard");
    res.status(404).json({
      success: false,
    });
  }
};

const toggleRestaurantOpen = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Find the exact restu by ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restuarant not found" });
    }

    // Toggle the is_open field
    restaurant.is_open = !restaurant.is_open;

    // Save the updated state
    await restaurant.save();

    return res
      .status(200)
      .json({ message: "is_open status updated", is_open: restaurant.is_open });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFood = async (req, res) => {
  try {
    const food_items = await FoodModel.find({});
    const food_category = await FoodCategoryModel.find({});
    const restaurant = await RestaurantModel.find({});

    res.send([food_items, food_category, restaurant]);
  } catch (error) {
    console.error("Error in getAllFood:", error);
    return res.json({ success: false });
  }
};

const addFood = async (req, res) => {
  try {
    const category = await FoodCategoryModel.findOne({
      CategoryName: req.body.CategoryName,
    });
    if (!category) {
      await FoodCategoryModel.create({
        CategoryName: req.body.CategoryName,
      });
    }

    await FoodModel.create({
      name: req.body.name,
      restaurant_id: req.body.restaurant_id,
      CategoryName: req.body.CategoryName,
      price: req.body.price,
      img: req.body.img,

      daysOfWeek: req.body.daysOfWeek, // added field daysOfWeek homekitchen
      startTime: req.body.startTime, // added field homekitchen
      endTime: req.body.endTime, // added field homekitchen
      minOrder: req.body.minOrder, // added field homekitchen
    });
    res.json({ message: "New food added!" });
  } catch (error) {
    console.log(error);
    res.json({ message: "food not added!" });
  }
};

const deleteFood = async (req, res) => {
  try {
    const foodId = req.params.foodId;
    const deletedFood = await FoodModel.findByIdAndDelete(foodId);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res.status(200).json({ message: "Food item deleted" });
  } catch (error) {
    console.error("Error deleting food item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editFood = async (req, res) => {
  try {
    const foodId = req.params.foodId;
    const updatedData = req.body;

    // Find the food item by ID and update its data
    const updatedFood = await FoodModel.findByIdAndUpdate(foodId, updatedData, {
      new: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res
      .status(200)
      .json({ message: "Food item updated successfully", updatedFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating food item" });
  }
};

const stockoutToggle = async (req, res) => {
  const { foodId } = req.params;

  try {
    // Find the food item by ID
    const foodItem = await FoodModel.findById(foodId);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Toggle the is_instock field
    foodItem.is_instock = !foodItem.is_instock;

    // Save the updated food item
    await foodItem.save();

    return res.json({
      message: "Stock Out status updated",
      isStockOut: foodItem.is_instock,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function updateFoodStock(foodId, newStockStatus, restaurantId) {
  const food = await FoodModel.findById(foodId);

  if (!food) {
    console.log("Food item not found");
    return;
  }

  food.inStock = newStockStatus;
  await food.save();

  // Using the passed restaurantId parameter now
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    console.log("Restaurant not found");
    return;
  }

  // If the restaurant is a home kitchen, check stock status.
  if (restaurant.is_homekitchen) {
    const allFoods = await FoodModel.find({ restaurant_id: restaurantId });

    // Check if all foods are out of stock
    const allOutOfStock = allFoods.every(f => !f.is_instock);

    if (allOutOfStock) {
      restaurant.hasStock = false;
      restaurant.is_open = false; // Close the restaurant
    } else {
      restaurant.hasStock = true;
      restaurant.is_open = true; // Open the restaurant
    }

    await restaurant.save();
  }
}

const updateStock = async (req, res) => {
  try {
    const { foodId, restaurantId } = req.params;
    const { inStock } = req.body; // true or false
    await updateFoodStock(foodId, inStock, restaurantId); // Call the function to update the stock and restaurant's is_open field
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRating = async (req,res)=>{
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await RestaurantModel.findById(restaurantId);

    res.json({ success: true, averageRating: restaurant.averageRating });
  } catch (error) {
    console.error('Error in /rate:', error);
    res.json({ success: false, message: 'An error occurred' });
  }
}

const getReview = async(req,res)=>{
  try {
    const restaurant = await RestaurantModel.findById(req.params.restaurantId);
    // console.log(restaurant.reviews[24].username);
    res.status(200).json({ success: true, reviews: restaurant.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
}

const setUserRating = async(req,res)=>{
  try {
    const restaurantId = req.params.restaurantId;
    const { userId, rating } = req.body;

    const restaurant = await RestaurantModel.findById(restaurantId);

    // Remove existing rating by this user if any
    restaurant.ratings = restaurant.ratings.filter(r => r.user.toString() !== userId);

    // Add new rating
    restaurant.ratings.push({ user: userId, rating });

    // Recalculate the average rating
    const totalRating = restaurant.ratings.reduce((acc, r) => acc + r.rating, 0);
    restaurant.averageRating = totalRating / restaurant.ratings.length;

    await restaurant.save();

    res.json({ success: true, averageRating: restaurant.averageRating });
  } catch (error) {
    console.error('Error in /rate:', error);
    res.json({ success: false, message: 'An error occurred' });
  }
}

const setUserReview = async(req,res)=>{
  const { userId, userName, review } = req.body;
  const restaurantId = req.params.restaurantId;
  // Validate data

  // Update restaurant data
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }
  
  restaurant.reviews.push({ user: userId, username: userName, review ,date: Date.now()});
  await restaurant.save();

  return res.status(200).json({ success: true, message: 'Review successfully added' });
}

const getSpecificRestaurantRating = async(req,res)=>{
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json(restaurant.ratings);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

const getSpecificRestaurant = async(req,res)=>{
  try {
    const restaurant = await RestaurantModel.findById(req.params.restaurantId);
    res.send(restaurant);
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
}

const getSpecificUserRatingForSpecificRestaurant = async (req, res) => {
  const { restaurantId, userId } = req.params;
  

  try {
    // Find the restaurant by ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    
    // Find the user's rating in the restaurant's ratings array
    const userRating = restaurant.ratings.find(rating => rating.user.toString() === userId);
  

    if (!userRating) {
      return res.status(404).json({ message: 'User rating not found for this restaurant' });
    }

    // Return the user's rating
    res.json({ rating: userRating.rating });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addOfferedFood = async (req, res) => {
   const { restaurantId, foodId } = req.params;
   const { foodItemName,img,offeredCatagoryName,mainPrice,offeredPrice,is_instock } = req.body; 
   
   try {
    const offeredFood = await OfferedFoodModel.create({
      foodId: foodId,
      restaurant_id: restaurantId,
      foodItemName: foodItemName,
      img: img,
      offeredCatagoryName: offeredCatagoryName,
      mainPrice: mainPrice,
      offeredPrice: offeredPrice,
      discountPercentage: ((mainPrice - offeredPrice) / mainPrice) * 100,
      is_instock: is_instock,
    });
    
    res.status(200).json(offeredFood);  
  }
  catch (error) {
    console.log(error.message);
    console.log("error in adding offered food");
    res.json({ message: "offered food not added!" });
  }
}

const removeOfferedFood = async (req, res) => {
  const { restaurantId, foodId } = req.params;
  try {
    const removedOfferedFood = await OfferedFoodModel.findOneAndDelete({ foodId: foodId, restaurant_id: restaurantId });
    if (!removedOfferedFood) {
      return res.status(404).json({ message: 'Offered food not found' });
    }
    res.status(200).json(removedOfferedFood);
  } catch (error) {
    console.log("error in removing offered food");
    res.json({ message: "offered food not removed!" });
  }
}

const getSpecificRestaurantOfferedFood = async (req, res) => {
   const { restaurantId } = req.params;
    try {
      const offeredFood = await OfferedFoodModel.find({ restaurant_id: restaurantId });
      res.status(200).json(offeredFood);
    }
    catch (error) {
      console.log("error in getting offered food");
      res.json({ message: "offered food not found!" });
    }
}

const editOfferedFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const updatedData = req.body;

    // Find the food item by custom ID and update its data
    const updatedFood = await OfferedFoodModel.findOneAndUpdate({ foodId: foodId }, updatedData, {
      new: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res
      .status(200)
      .json({ message: "Food item updated successfully", updatedFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating food item" });
  }
};

const getSpecificOfferedFoodForSpecificRestaurant = async(req,res)=>{
    const { restaurantId, foodId } = req.params;
    try {
      const offeredFood = await OfferedFoodModel.findOne({ restaurant_id: restaurantId, foodId: foodId });
      res.status(200).json(offeredFood);
    }
    catch (error) {
      console.log("error in getting offered food");
      
      res.json({ message: "offered food not found!" });
    }
}

const addOfferFoodCategory = async (req, res) => {
  try {
    const { CategoryName } = req.body;

    // Check if the food category already exists
    const existingCategory = await OfferFoodCategoryModel.findOne({ CategoryName });

    if (existingCategory) {
      return res.status(400).json({ message: "Food category already exists" });
    }

    // Create a new food category
    const category = await OfferFoodCategoryModel.create({ CategoryName });

    res.status(200).json(category);
  } catch (error) {
    console.log("error in adding food category");
    res.json({ message: "food category not added!" });
  }
}

const getRestaurantInfo = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.restaurant_id);
    res.status(200).json(restaurant);
  } catch (error) {
    console.log("error in getting restaurant info");
    res.json({ message: "restaurant info not found!" });
  }
}





module.exports = {
  signupRestaurant,
  loginRestaurant,
  showDashboard,
  toggleRestaurantOpen,
  getAllFood,
  addFood,
  deleteFood,
  editFood,
  stockoutToggle,
  updateStock,
  getRating,
  getReview,
  setUserRating,
  setUserReview,
  getSpecificRestaurantRating,
  getSpecificRestaurant,
  getSpecificUserRatingForSpecificRestaurant,
  addOfferedFood,
  removeOfferedFood,
  getSpecificRestaurantOfferedFood,
  editOfferedFood,
  getSpecificOfferedFoodForSpecificRestaurant,
  addOfferFoodCategory,
  getRestaurantInfo,
};
