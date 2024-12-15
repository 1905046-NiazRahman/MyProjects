const express = require("express")
const router = express.Router()
const controllers= require("../controllers/UserAuthController")

router.route("/signup")
        .post(controllers.signupUser)

router.route("/login")
        .post(controllers.loginUser)



module.exports=router