const {createUserService} = require("../services/userServices");

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
        return res.status(error.statusCode).json({
            message : error.message || "Beklenmeyen hata oluştu."
        }) ;
    }
} ;

module.exports = {createUserController} ;