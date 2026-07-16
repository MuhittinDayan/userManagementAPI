const db = require("../config/db") ;
const {encryptTcNo,decryptTcNo,createTcHash} = require("../utils/encryption") ;



const createUserService = async(userData) => {
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
    const tcHash = createTcHash(tcNo) ;
    const [tcControl] =await db.query("SELECT * FROM users WHERE tc_hash = ?", [tcHash]) ;
    if(tcControl.length){
        const error = new Error("Bu TC no ile daha önce kullanıcı kaydı bulunmaktadır.") ;
        error.statusCode = 409 ;
        throw error ;
    }
    const tcEncrypted = encryptTcNo(tcNo) ;
    await db.query("INSERT INTO users(name,email,age,tc_encrypted,tc_hash) VALUES(?,?,?,?,?)",[name,email,age,tcEncrypted,tcHash]) ;

    const newUser = {
        name,email,age 
    } ;
    return newUser ;
};

const getUsersService = async() => {
    const [users] = await db.query("SELECT * FROM users") ;
    if(!users.length){
        const error = new Error("Kullanıcı kaydı bulunamadı") ;
        error.statusCode = 404 ;
        throw error ;
    }
    const userData = users.map(user =>{
        const {name,email,age,tc_encrypted} = user ;
        const tcNo = decryptTcNo(tc_encrypted) ;
        const tcNoMask =(tcNo) => {
            return tcNo.slice(0,2) + ("*").repeat(7) + tcNo.slice(9,11) ;
        }
        const maskedTcNo = tcNoMask(tcNo) ;
        return{
            name ,email , age , maskedTcNo
        }
    })
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
    const tcNo = decryptTcNo(user[0].tc_encrypted) ;
    const tcNoMask = (tcNo) => {
        return tcNo.slice(0,2) + "*".repeat(7) + tcNo.slice(9,11) ; 
    }
    const maskedTcNo = tcNoMask(tcNo) ;
    const {name , email , age } = user[0] ;
    const newUser = {
        name ,email , age ,maskedTcNo 
    } ;

    return newUser ;
} ;

const updateUserByIdService = async(id,userData) => {
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

    const [userEmailControl] = await db.query("SELECT * FROM users WHERE email = ? AND userId != ?",[email,Number(id)]);
    if(userEmailControl.length >= 1){
        const error = new Error("Bu e-mail adresiyle kayıtlı başka bir kullanıcı bulunmaktadır.");
        error.statusCode = 409 ;
        throw error;
    }
    const tc_hash = createTcHash(tcNo) ;
    const [tcHashControl] = await db.query("SELECT * FROM users WHERE userId != ? AND tc_hash = ?" ,[Number(id),tc_hash]) ;
    if(tcHashControl.length >=1){
        const error = new Error("Bu TC no ile başka bir kullanıcı kayıtlıdır.");
        error.statusCode = 409 ;
        throw error ;
    }
    const newEncrytedTcNo = encryptTcNo(tcNo) ;
    await db.query("UPDATE users SET name = ? , email = ? ,age = ?, tc_encrypted = ? ,tc_hash= ? WHERE userId = ?",[name,email,age,newEncrytedTcNo,tc_hash,id]);
    return ;


} ;

const deleteUserByIdService = async(id) => {
    if(!id){
        const error = new Error("Kullanıcı id bilgisi alınamadı.");
        error.statusCode = 400 ;
        throw error
    }
    if(isNaN(Number(id))){
        const error = new Error("Id bilgisi doğru formatta değil") ;
        error.statusCode = 400 ;
        throw error ;
    }
    const [userData] = await db.query("SELECT * FROM users WHERE userId = ?",[Number(id)]);
    if(!userData.length){
        const error = new Error("Silinmek istenen kullanıcı bulunmamaktadır.");
        error.statusCode = 404 ;
        throw error ;
    }
    await db.query("DELETE FROM users WHERE userId = ? ", [id]);

    return ;

} ;

module.exports = {
    createUserService,
    getUsersService,
    getUserByIdService,
    updateUserByIdService,
    deleteUserByIdService
} ;
