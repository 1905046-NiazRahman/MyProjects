const express = require('express');
const router = express.Router();

const controllers = require('../controllers/HomeKichenController');

router.route("/getorder/:orderId")
      .get(controllers.getSpecificOrder)

router.route("/acceptpreorder/:orderId")
      .put(controllers.acceptPreordered)

module.exports = router;