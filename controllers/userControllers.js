const {createUserService,
        getUsersService,
        getUserByIdService,
        updateUserByIdService,
        deleteUserByIdService
} = require("../services/userServices");


const createUserController = async (req,res) => {
    try{
        const {name,email,tcNo,age} = req.body ;

        const newUser = await createUserService({
            name,email,tcNo,age
        }) ;

        return res.status(201).json({
            message : req.t("USER_CREATED") ,user : newUser
        }) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : req.t(error.message) || req.t("UNEXPECTED_ERROR")
        }) ;
    }
} ;

const getUsersController = async(req,res) => {
    try{
        const {search,age,minAge,maxAge} = req.query ;
        const userData = await getUsersService(search,age,minAge,maxAge) ;
        return res.status(200).json(userData) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : req.t(error.message) || req.t("UNEXPECTED_ERROR")
        }) ;
    }
} ;

const getUserByIdController = async(req,res) =>{
    try{
        const id = req.params.id ;
        const userData = await getUserByIdService(id) ;
        const {name,email,maskedTcNo,age} = userData;

        return res.status(200).json({
            name,email,maskedTcNo,age
        }) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : req.t(error.message) || req.t("UNEXPECTED_ERROR")
        }) ;
    }

} ;

const updateUserByIdController = async(req,res)=>{
    try{
        const id = req.params.id ;
        const {name,email,tcNo,age} = req.body ;
        
        await updateUserByIdService(id, {
            name,email,tcNo,age
        });
        return res.status(200).json({
            message : req.t("USER_UPDATED")
        });
    }
    catch(error){
        console.log(error);
        return res.status(error.statusCode || 500).json({
            message : req.t(error.message) || req.t("UNEXPECTED_ERROR")
        }) ;
    }

} ;

const deleteUserByIdController = async(req,res) =>{
    try{
        const id = req.params.id ;
        await deleteUserByIdService(id) ;

        return res.status(200).json({
            message : req.t("USER_DELETED")
        }) ;
    }
    catch(error){
        console.log(error);
        return res.status(error.statusCode || 500).json({
            message : req.t(error.message) || req.t("UNEXPECTED_ERROR")
        }) ;
    }
}

module.exports = {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserByIdController,
    deleteUserByIdController
} ;
