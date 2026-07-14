const mysql = require("mysql2/promise") ;
require("dotenv").config();


const db = mysql.createPool({
    "host" : "localhost" ,
    "user" : "root" ,
    "password" : process.env.DB_PASSWORD,
    "database" : process.env.DB_DATABASE
}) ;

module.exports = db ;