const express = require("express") ;
const cors = require("cors") ;
const app = express() ;
const rateLimit = require("express-rate-limit") ;

const userRoutes = require("./routes/userRoutes")
app.use(express.json()) ;
app.use(cors());
app.use(userRoutes) ;


const PORT = 3000 ;

app.listen(PORT) ;