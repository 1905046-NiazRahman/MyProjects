const express = require("express")
const router = express.Router()
const controllers= require("../controllers/DistanceController")

router.route("/currentDp/setLocation")
        .post(controllers.postDpLocation)
router.route("/currentUser/setLocation")
        .post(controllers.postUserLocation)
router.route("/getLocations")
        .get(controllers.getLocationData)
router.route("/deleteLocation")
        .delete(controllers.deleteAllLocationData)

module.exports = router;