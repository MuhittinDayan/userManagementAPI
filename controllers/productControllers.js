const {
    createProductService ,
    getProductsService ,
    getProductByIdService ,
    updateProductService ,
    deleteProductService
} = require("../services/productServices") ;

const createProductController = async(req,res) =>{
    try{
        const {name,sku,price,stock,category} = req.body ;

        const newProduct = await createProductService({
            name,sku,price,stock,category
        }) ;

        return res.status(201).json({
            message : req.t("PRODUCT_CREATED") , product : newProduct 
        }) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        }) ;
    }
} ;

const getProductsController = async(req,res) =>{
    try{
        const productData = await getProductsService() ;
    
        return res.status(200).json(productData) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        }) ;
    }
} ;

const getProductByIdController = async(req,res) =>{
    try{
        const id = req.params.id ;
        const productData = await getProductByIdService(id) ;
        return res.status(200).json(productData) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
    }
} ;

const updateProductController = async(req,res) =>{
    try{
        const id = req.params.id ;
        const {name,sku,price,stock,category} = req.body ;

        await updateProductService(id , {
            name,sku,price,stock,category
        })

        return res.status(200).json(req.t("PRODUCT_UPDATED")) ;
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
    }
} ;

const deleteProductController = async(req,res) =>{
    try{
        const id = req.params.id ;
        await deleteProductService(id) ;

        return res.status(200).json(req.t("PRODUCT_DELETED")) ;    
    }
    catch(error){
        console.log(error) ;
        return res.status(error.statusCode || 500).json({
            message : error.statusCode ? req.t(error.message) : req.t("UNEXPECTED_ERROR")
        })
    }

}


module.exports = {
    createProductController,
    getProductsController ,
    getProductByIdController,
    updateProductController ,
    deleteProductController
} ;
