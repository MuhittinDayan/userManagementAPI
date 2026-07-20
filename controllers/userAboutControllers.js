
const {
    createUserAboutService,
    getUserAboutByIdService ,
    updateUserAboutService ,
    deleteUserAboutService,
    getUsersAboutService
} = require("../services/userAboutServices") ;


const createUserAboutController = async(req,res) =>{
    try{
        const userId = req.params.id ;
        const {about,about_language } = req.body ;

        const aboutData = await createUserAboutService({
            userId,about,about_language
        }) ;

        return res.status(201).json({
            message : req.t("ABOUT_CREATED") , user_about : aboutData 
        }) ;
    }
    catch(error){
        console.log(error);
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
    }
} ;

const getUserAboutByIdController = async(req,res) =>{
    try{
        const userId = req.params.id ;

        const aboutData = await getUserAboutByIdService(userId) ;
        
        return res.status(200).json(aboutData) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR") 
        })
    }
} ;

const updateUserAboutController = async(req,res) =>{
    try{
        const userId = req.params.id ;
        const {about , about_language} = req.body ;

        await updateUserAboutService(userId,{
            about,about_language
        }) ;

        return res.status(200).json({message: req.t("ABOUT_UPDATED")})
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
    }


} ;

const deleteUserAboutController = async(req,res) =>{
    
    try{
        const userId = req.params.id ;

        await deleteUserAboutService(userId) ;

        return res.status(200).json({message: req.t("ABOUT_DELETED")}) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
    }

    
} ;

const getUsersAboutController = async(req,res) =>{
   try{
        const aboutData = await getUsersAboutService() ;
        return res.status(200).json(aboutData) ;
   }
   catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
   }
}
module.exports = {
    createUserAboutController,
    getUserAboutByIdController,
    updateUserAboutController,
    deleteUserAboutController ,
    getUsersAboutController
}