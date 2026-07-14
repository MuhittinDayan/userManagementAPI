const express = require("express") ;
const router = express.Router() ;
const {createUserController} = require("../controllers/userControllers")

router.post("/users", createUserController) ;
// router.get("/" ,userControllers.getUsersController)  ;
// router.get("/:id", userControllers.getUserByIdController) ;
// router.put("/:id", userControllers.updateUserByIdController) ;

module.exports = router ;