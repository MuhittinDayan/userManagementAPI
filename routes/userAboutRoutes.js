const express = require("express") ;
const router = express.Router() ;

const {
    createUserAboutController,
    getUserAboutByIdController,
    updateUserAboutController,
    deleteUserAboutController ,
    getUsersAboutController
} = require("../controllers/userAboutControllers") ;

const {validate} = require("../middlewares/validate") ;
const {aboutSchema,idParamSchema} = require("../validation/userAboutFields") ;

router.post("/users/:id/about" , validate(idParamSchema,"params") , validate(aboutSchema,"body") ,createUserAboutController)
router.get("/users/:id/about", validate(idParamSchema,"params") ,getUserAboutByIdController) ;
router.put("/users/:id/about",validate(idParamSchema,"params") , validate(aboutSchema,"body"), updateUserAboutController) ;
router.delete("/users/:id/about" ,validate(idParamSchema,"params") ,deleteUserAboutController) ;
router.get("/user-abouts", getUsersAboutController)

module.exports = router ;