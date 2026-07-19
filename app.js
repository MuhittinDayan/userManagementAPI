const express = require("express") ;
const cors = require("cors") ;
const app = express() ;
const rateLimit = require("express-rate-limit") ;

const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes") ;
const {i18next,middleware} = require("./config/i18n") ;

app.use(express.json()) ;
app.use(cors());
app.use(middleware.handle(i18next)) ;
app.use(userRoutes) ;
app.use(productRoutes) ;

const PORT = 3000 ;


// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err) ;
    return res.status(err.statusCode || 500).json({
        message: err.message || (req.t("UNEXPECTED_ERROR"))
    }) ;
}) ;


app.listen(PORT) ;