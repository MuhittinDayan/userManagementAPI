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
    if(!tcNo || tcNo.length !== 11){
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

const getUsersService = async() => {
    const [userData] = await db.query("SELECT name , email , tcNO , age FROM users") ;
    if(!userData.length){
        const error = new Error("Kullanıcı kaydı bulunamadı") ;
        error.statusCode = 404 ;
        throw error ;
    }
    return userData ;
} ;

const getUserByIdService = async(id)=> {
    if(!id){
        const error = new Error("Kullanıcı id'si alınamadı.") ;
        error.statusCode = 400 ;
        throw error ;
    }
    if(isNaN(Number(id))){
        const error = new Error("Id doğru formatta değil.") ;
        error.statusCode = 400 ;
        throw error ;
    }
    const [user] = await db.query("SELECT * FROM users WHERE userId = ?" , [Number(id)]) ;

    if(!user.length){
        const error = new Error("Bu id'ye ait kullanıcı bulunmamaktadır") ;
        error.statusCode = 404 ;
        throw error ;
    } 
    return user[0] ;
} ;

const updateUserByIdService = async(id,userData) =>{
    const {name,email,tcNo,age} = userData ;
    if(!id){
        const error = new Error("Kullanıcı id'si alınamadı.") ;
        error.statusCode = 400 ;
        throw error ;
    }
    if(isNaN(Number(id))){
        const error = new Error("Id doğru formatta değil.") ;
        error.statusCode = 400 ;
        throw error ;
    }
    const [userResult] = await db.query("SELECT * FROM users WHERE userId = ?", [Number(id)]);
     
    if(!userResult.length){
        const error = new Error("Bu id'ye ait kullanıcı bulunmamaktadır");
        error.statusCode = 404 ;
        throw error ;
    }
    if(!name || !email){
        const error = new Error("Kullanıcı bilgisi eksik veya hatalı") ;
        error.statusCode = 400 ;
        throw error ;
    }
    if(!email.includes("@")){
        const error = new Error("E-mail doğru formatta değil.");
        error.statusCode = 400 ;
        throw error ;
    }

    if(!tcNo || tcNo.length !==11 ){
        const error = new Error("TC kimlik numarası 11 haneli olmalıdır");
        error.statusCode = 400 ;
        throw error ;
    }
    if(isNaN(Number(age))){
        const error = new Error("Yaş bilgisi sayısal olmalıdır.");
        error.statusCode = 400 ;
        throw error ;
    }
    if(Number(age) < 18){
        const error = new Error("Kullanıcı yaşı 18 veya daha büyük olmalıdır.");
        error.statusCode =400 ;
        throw error ;
    }

    const [userEmailControl] = await db.query("SELECT * FROM users WHERE email = ? AND userId != ?",[email,id]);
    if(userEmailControl.length >= 1){
        const error = new Error("Bu e-mail adresiyle kayıtlı başka bir kullanıcı bulunmaktadır.");
        error.statusCode = 409 ;
        throw error;
    }

    await db.query("UPDATE users SET name = ? , email = ? , tcNo = ? ,age = ? WHERE userId = ?",[name,email,tcNo,age,id]);
    return ;


} ;


module.exports = {
    createUserService,
    getUsersService,
    getUserByIdService,
    updateUserByIdService
} ;
