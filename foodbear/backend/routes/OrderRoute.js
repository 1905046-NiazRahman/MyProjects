const express = require("express")
const router = express.Router()
const controllers= require("../controllers/OrderController")
const controllers2= require("../controllers/OrderReviewController")
//user order portion
router.route("/user/orders/neworder")
      .post(controllers.placeUserOrder)
router.route("/user/orders/:userId")
      .get(controllers.getUserOrder)

//will be used in mycart
router.route("/user/food/:foodId")
      .get(controllers.getFoods)
//will be used in ordered foods
router.route("/user/foods")
      .get(controllers.getAllOrderedFoods)
//restaurant portion
router.route("/restaurant/orders/:restaurantId")
      .get(controllers.getSpecificRestaurantOrder) //this will also be used for order count
router.route("/restaurant/deleteorder/:orderId")
      .delete(controllers.rejectOrder)
router.route("/restaurant/orders/confirmorder/:orderId/:deliverypersonId")
      .put(controllers.acceptOrder)

//delivery person portion
router.route("/deliveryperson/:deliverypersonId")
      .get()
router.route("/deliveryperson/orders/:deliverypersonId")
      .get(controllers.getAllOrderofSpecificDpPerson)
router.route("/deliveryperson/orders/pickeduporder/:orderId")
      .put(controllers.handlePickupOrder)
router.route("/deliveryperson/orders/deliveredorder/:orderId")
      .put(controllers.deliverOrder)

router.route("/all/getAllOrders")
      .get(controllers.getAllOrders)

router.route("/orderReview/addOrderReview")
      .post(controllers2.createOrderReview)

router.route("/orderReview/getOrderReview/:userId/:restaurantId/:orderId")
      .get(controllers2.getOrderReview)

//this should not be here,but i had to keep it here as it was not working in the restaurant route
router.route("/offer/getoffercatagory")
      .get(controllers.findCatagory)

//weired!!!
router.route("/homekitchen/:foodId")
      .get(controllers.getFoodForHomeKitchen)

module.exports = router;