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
            message : "Yeni kullanıcı kaydı başarılı." ,user : newUser
        }) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.message || "Beklenmeyen hata oluştu."
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
            message : error.message || "Beklenmeyen bir hata oluştu..."
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
            message : error.message || "Beklenmeyen bir hata oluştu..."
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
            message :"Kullanıcı güncelleme işlemi başarılı"
        });
    }
    catch(error){
        console.log(error);
        return res.status(error.statusCode || 500).json({
            message : error.message || "Beklenmeyen bir hata oluştu..."
        }) ;
    }

} ;

const deleteUserByIdController = async(req,res) =>{
    try{
        const id = req.params.id ;
        await deleteUserByIdService(id) ;

        return res.status(200).json({
            message : "Kullanıcı başarıyla silindi" 
        }) ;
    }
    catch(error){
        console.log(error);
        return res.status(error.statusCode || 500).json({
            message : error.message || "Beklenmeyen bir hata oluştu..."
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
