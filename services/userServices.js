const db = require("../config/db") ;

const createUserService = async(userData) =>{
    const {name,email,tcNo,age} = userData ;
    if(!name || !email ){
        const error = new Error("Kullanıcı bilgisi hatalı veya eksik") ;
        error.statusCode = 400 ;
        throw error ;
    }
    if(!email.includes("@")){
        const error = new Error("E-mail doğru formatta değil.") ;
        error.statusCode = 400 ;
        throw error ;
    }
    if(!tcNo || tcNo.length != 11){
        const error = new Error("Tc kimlik numarası 11 haneli olmalıdır.");
        error.statusCode = 400 ;
        throw error ;
    }
    if(isNaN(Number(age))){
        const error = new Error("Yaş bilgisi sayısal olmalıdır.");
        error.statusCode = 400 ;
        throw error ;
    }
    if(Number(age) <18){
        const error = new Error("Yaş 18den büyük veya eşit olmalıdır");
        error.statusCode = 400 ;
        throw error ;
    }
    const [userEmailControl] = await db.query("SELECT * FROM users WHERE email = ?",[email]) ;
    if(userEmailControl.length){
        const error = new Error("Bu e-mail ile kayıtlı kullanıcı vardır") ;
        error.statusCode = 409 ;
        throw error ;
    }

    await db.query("INSERT INTO users(name,email,tcNo,age) VALUES(?,?,?,?)",[name,email,tcNo,age]) ;

    const newUser = {
        name,email,tcNo,age 
    } ;
    return newUser ;
};

module.exports = {createUserService} ;
