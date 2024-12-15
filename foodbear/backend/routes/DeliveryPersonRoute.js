const express = require("express")
const router = express.Router()
const controllers= require("../controllers/DeliveryPersonController")

router.route("/login")
        .post(controllers.loginDeliveryPerson)

router.route("/signup")
        .post(controllers.signupDeliveryPerson)

router.route("/dashboard")
        .get(controllers.dashboardDeliveryPerson)

router.route("/isavailable/:deliverypersonId")
        .put(controllers.isAvailableDeliveryPerson)
router.route("/location/:dpId")
        .put(controllers.updateLocationDeliveryPerson)

module.exports = router;