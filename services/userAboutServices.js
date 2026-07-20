
const db = require("../config/db") ;

const createUserAboutService = async(aboutData) =>{
    
    const {userId,about,about_language} = aboutData ;
    const [users] = await db.query("SELECT userId FROM users WHERE userId = ?", [userId]) ;

    if(!users.length){
        const error = new Error("USER_NOT_FOUND") ;
        error.statusCode = 404 ;
        throw error ;
    }
    
    const [existingAbout] = await db.query("SELECT id FROM user_about WHERE userId = ?" ,[userId]) ;

    if(existingAbout.length){
        const error = new Error("ABOUT_ALREADY_EXISTS");
        error.statusCode = 409 ;
        throw error ;
    }


    const [result] = await db.query("INSERT INTO user_about(userId,about,about_language) VALUES(?,?,?)" ,[userId,about,about_language]) ;
    
    const newUserAbout = {userAboutId : result.insertId , userId , about ,about_language} ;

    return newUserAbout ;
} ;

const getUserAboutByIdService = async(userId) =>{
    const [user] = await db.query("SELECT userId FROM users WHERE userId = ? " ,[userId]) ;

    if(!user.length){
        const error = new Error("USER_NOT_FOUND") ;
        error.statusCode = 404 ;
        throw error;
    }

    const [aboutRows] = await db.query("SELECT about,about_language FROM user_about WHERE userId = ?",[userId]) ;

    if(!aboutRows.length){
        const error = new Error("ABOUT_NOT_FOUND") ;
        error.statusCode = 404 ;
        throw error;
    }

    const {about,about_language} = aboutRows[0] ;

    return {
        userId,about,about_language
    }
} ;

const updateUserAboutService = async(userId,aboutData) =>{
    const {about, about_language} = aboutData ;

    const [user] = await db.query("SELECT userId FROM users WHERE userId = ? ", [userId]) ;
    if(!user.length){
        const error = new Error("USER_NOT_FOUND") ;
        error.statusCode = 404 ;
        throw error ;
    }

    const [aboutRow] = await db.query("SELECT about FROM user_about WHERE userId = ? ", [userId]) ;
    if(!aboutRow.length){
        const error = new Error("ABOUT_NOT_FOUND") ;
        error.statusCode = 404; 
        throw error; 
    }

    await db.query("UPDATE user_about SET about = ? , about_language = ? WHERE userId = ?" ,[about,about_language,userId]) ;

    return ;
} ;

const deleteUserAboutService = async(userId) =>{
    const [user] = await db.query("SELECT userId FROM users WHERE userId = ? ", [userId]) ;
    if(!user.length){
        const error = new Error("USER_NOT_FOUND") ;
        error.statusCode = 404 ;
        throw error ;
    }
    const [aboutRow] = await db.query("SELECT about FROM user_about WHERE userId = ? ", [userId]) ;
    if(!aboutRow.length){
        const error = new Error("ABOUT_NOT_FOUND") ;
        error.statusCode = 404; 
        throw error; 
    }

    await db.query("DELETE FROM user_about WHERE userId = ? ", [userId]) ;
    return ;

} ;

const getUsersAboutService = async() =>{
    const [usersAbout] = await db.query("SELECT userId , about , about_language FROM user_about ");

    if(!usersAbout.length){
        const error = new Error("ABOUTS_NOT_FOUND") ;
        error.statusCode = 404;
        throw error ;
    }

    const aboutData = usersAbout.map(abouts =>{
        const {userId , about,about_language} = abouts ;
        return {
            userId , about ,about_language
        }
    })
    return aboutData ;
}

module.exports = {
    createUserAboutService,
    getUserAboutByIdService ,
    updateUserAboutService ,
    deleteUserAboutService ,
    getUsersAboutService
};