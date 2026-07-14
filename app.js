const express = require("express") ;
const cors = require("cors") ;
const app = express() ;
const rateLimit = require("express-rate-limit") ;

const userRoutes = require("./routes/userRoutes")
app.use(express.json()) ;
app.use(cors());
app.use(userRoutes) ;


const PORT = 3000 ;


// app.post("/users",async (req,res)=>{

//     const {name,email,tcNo,age} = req.body ;

//     if(!name || !email ){
//         return res.status(400).json({message : "Kullanıcı bilgisi hatalı veya eksik."}) ;
//     }
//     if(!email.includes("@")){
//         return res.status(400).json({message : "E-mail doğru formatta değil."}) ;
//     }
//     // düzelecek satır
//     // const userEmailControl = users.find(user => user.email === email) ;
    
//     if(tcNo.length !== 11 ){
//         return res.status(400).json({message : "TC kimlik numarası 11 haneli olmalıdır."}) ;
//     }
//     if(isNaN(Number(age))){
//         return res.status(400).json({message : "Yaş bilgisi sayısal olmalıdır."}) ;
//     }
//     if(age <18) {
//         return res.status(400).json({message : "Kullanıcı yaşı 18den büyük olmalıdır."}) ;
//     }
//     try{
//         const [userEmailControl] = await db.query("SELECT * FROM users where email = ?",[email]) ;
//         if(userEmailControl.length === 1){
//             return res.status(409).json({message : "Bu e-mail adresiyle kayıtlı kullanıcı bulunmaktadır."}) ;
//         }

//         const newUser = {
//             name : name,
//             email : email,
//             tcNo : tcNo ,
//             age : age 
//         } ;

//         await db.query("INSERT INTO users(name,email,tcNo,age) VALUES(?,?,?,?)",[name,email,tcNo,age])

//         res.status(201).json({message : "Yeni kullanıcı kaydı başarılı" , user : newUser}) ;
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({message : "Beklenmeyen bir hata oluştu..."})
//     }
    

// })

app.get("/users" , async(req,res) =>{
    //     [
    //     { userId: 1, name: "Ahmet", email: "ahmet@mail.com", tcNo: "...", age: 25 },
    //     { userId: 2, name: "Ayşe", email: "ayse@mail.com", tcNo: "...", age: 30 },
    //     { userId: 3, name: "Mehmet", email: "mehmet@mail.com", tcNo: "...", age: 22 }
    // ]
    // bu elde edilen dizi doğrudan verilecek
    try{
        const [userData] = await db.query("SELECT name , email , tcNO , age FROM users") ;
        if(!userData.length){
            return res.status(404).json({message : "Kullanıcı kaydı bulunmamaktadır."});
        }

        res.status(200).json(userData) ;
    }
    catch(error){
        console.log(error) ;
        res.status(500).json({message : "Beklenmeyen bir hata oluştu..."});
    }

})

app.get("/users/:id",async (req,res)=>{
    const id = req.params.id ;
    if(!id) {
        return res.status(400).json({message : "Kullanıcı id'si alınamadı."})
    }
    try{
        const [user] = await db.query("SELECT * FROM users WHERE userId = ?", [Number(id)]) ;

        if(!user.length){
            return res.status(404).json({message : "İd bulunamadı"})
        }
        const {name,email,tcNo,age} = user[0] ;

        res.status(200).json({
            name,email,tcNo,age
        }) ;
    }
    catch(error){
        console.log(error) ;
        res.status(500).json({message : "Beklenmeyen bir hata oluştu ..."})
    }
    

})

app.put("/users/:id" , async(req,res)=>{
    const userId = req.params.id ;  
    // route parameters olduğu için params
    // route parameter : url'nin kendisinin parçası
    const {name,email,tcNo,age} = req.body ;

    try{
        const [userResult] = await db.query("SELECT * FROM users WHERE userId = ?",[userId]) ;
        if(userResult.length === 0){
            return res.status(404).json({message : "Bu id'ye ait kullanıcı bulunmamaktadır"}) ;
        }
        if(!name || !email ){
            return res.status(400).json({message : "Kullanıcı bilgisi hatalı veya eksik."}) ;
        }
        if(!email.includes("@")){
            return res.status(400).json({message : "E-mail doğru formatta değil."}) ;
        }

        if(tcNo.length !== 11 ){
            return res.status(400).json({message : "TC kimlik numarası 11 haneli olmalıdır."}) ;
        }
        if(isNaN(Number(age))){
            return res.status(400).json({message : "Yaş bilgisi sayısal olmalıdır."}) ;
        }
        if(age <18) {
            return res.status(400).json({message : "Kullanıcı yaşı 18den büyük olmalıdır."}) ;
        }
        const [userEmailControl] = await db.query("SELECT * FROM users where email = ?  AND userId != ?",[email,userId]) ;
        if(userEmailControl.length >= 1){
            return res.status(409).json({message : "Bu e-mail adresiyle kayıtlı başka bir kullanıcı bulunmaktadır."}) ;
        }
        await db.query("UPDATE users SET name = ? , email = ? , tcNo = ? ,age = ? WHERE userId = ?",[name,email,tcNo,age,userId]);

        res.status(200).json({message: "Kullanıcı güncelleme işlemi başarılı"}) ;
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "Beklenmeyen bir hata oluştu ..."})
    }
    


})

app.listen(PORT) ;