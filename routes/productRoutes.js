const express = require("express") ;
const router = express.Router() ;
const { createProductController , getProductsController ,getProductByIdController , updateProductController,deleteProductController} = require("../controllers/productControllers") ;
const {validate} = require("../middlewares/validate") ;
const {productSchema , idParamSchema} = require("../validation/productFields") ;
 
router.post("/products",validate(productSchema,"body") , createProductController) ;
router.get("/products" , getProductsController) ;
router.get("/products/:id",validate(idParamSchema,"params") , getProductByIdController) ;
router.put("/products/:id", validate(idParamSchema,"params") , validate(productSchema,"body") , updateProductController) ;
router.delete("/products/:id" , validate(idParamSchema , "params"),deleteProductController) ;
 


module.exports = router ;