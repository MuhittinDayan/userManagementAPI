const express = require("express") ;
const router = express.Router() ;
const {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserByIdController,
    deleteUserByIdController
} = require("../controllers/userControllers") ;

const {validate} = require("../middlewares/validate") ;
const { userDataSchema , idParamSchema ,userQuerySchema } = require("../validation/userFields");

router.post("/users",validate(userDataSchema,"body"), createUserController) ;
router.get("/users" ,validate(userQuerySchema,"query") ,getUsersController)  ;
router.get("/users/:id",validate(idParamSchema,"params"), getUserByIdController) ;
router.put("/users/:id",validate(idParamSchema,"params"),validate(userDataSchema,"body"), updateUserByIdController) ;
router.delete("/users/:id",validate(idParamSchema,"params") ,deleteUserByIdController) ;

module.exports = router ;