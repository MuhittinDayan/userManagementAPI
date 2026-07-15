const express = require("express") ;
const router = express.Router() ;
const {createUserController} = require("../controllers/userControllers") ;
const {getUsersController}  = require("../controllers/userControllers") ;
const {getUserByIdController} = require("../controllers/userControllers") ;
const {updateUserByIdController} = require("../controllers/userControllers");


router.post("/users", createUserController) ;
router.get("/users" ,getUsersController)  ;
router.get("/users/:id", getUserByIdController) ;
router.put("/users/:id", updateUserByIdController) ;

module.exports = router ;