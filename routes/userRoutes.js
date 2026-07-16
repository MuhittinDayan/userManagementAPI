const express = require("express") ;
const router = express.Router() ;
const {createUserController} = require("../controllers/userControllers") ;
const {getUsersController}  = require("../controllers/userControllers") ;
const {getUserByIdController} = require("../controllers/userControllers") ;
const {updateUserByIdController} = require("../controllers/userControllers");
const {deleteUserByIdController} = require("../controllers/userControllers") ;
const {validate} = require("../middlewares/validate") ;
const { userDataSchema , idParamSchema } = require("../validation/commonFields");

router.post("/users",validate(userDataSchema,"body"), createUserController) ;
router.get("/users" ,getUsersController)  ;
router.get("/users/:id",validate(idParamSchema,"params"), getUserByIdController) ;
router.put("/users/:id",validate(idParamSchema,"params"),validate(userDataSchema,"body"), updateUserByIdController) ;
router.delete("/users/:id",validate(idParamSchema,"params") ,deleteUserByIdController) ;

module.exports = router ;