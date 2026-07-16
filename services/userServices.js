const db = require("../config/db") ;
const {encryptTcNo,decryptTcNo,createTcHash} = require("../utils/encryption") ;



const createUserService = async(userData) => {
    const {name,email,tcNo,age} = userData ;

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
    const [users] = await db.query("SELECT name,email,age,tc_encrypted FROM users") ;
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
