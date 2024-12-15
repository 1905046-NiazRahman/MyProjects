const express = require('express');
const router = express.Router();

// Assuming you have a VoucherController with an addVoucher method
const controllers = require('../controllers/VoucherController');

router.route("/addvoucher")
        .post(controllers.createVoucher)
router.route("/getallusers")
       .get(controllers.getAllUsers)
router.route("/getvoucher/:restaurant_id")
        .get(controllers.getVoucher)
        .delete(controllers.deleteVoucher)
router.route('/updatevoucher/:id')
        .put(controllers.updatevoucher)

module.exports = router;
