const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const controllers = require("../controllers/UserController");

const jwtSecret = "SheIsJustAGirlWhoClaimsThatIAmTheOneButTheKidIsNotMySon";

router.route("/restaurants")
      .get(controllers.getAllRestaurant)


router.route("/:userId")
      .get(controllers.showDashboard)

router.route("/addtocart")
      .post(controllers.addToCart)
router.route("/getcart")
      .post(controllers.getCart) 
router.route("/getfood")
      .post(controllers.getFood)

//cart handlig
router.route("/decreasefoodquantity")
      .post(controllers.decreaseSpecificFoodQuantity)
router.route("/deletespecificfoodfromcart")
      .post(controllers.deleteSpecificFoodFromCart)
router.route("/deleteallfoodafterpayment")
      .post(controllers.deleteAllFromCartAfterPayemnt)

router.route("/favorites/add")
      .post(controllers.addFavourite)
router.route("/favorites/remove")
      .post(controllers.removeFavourite)
router.route("/favorites/:userId")
      .get(controllers.getFavourite)


router.route("/updateLocation/:userId")
      .put(controllers.updateUserLocation)

// router.route("/getallusers")
//       .get(controllers.getAllUsers)

module.exports = router; 
