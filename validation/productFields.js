const {z} = require("zod") ;

const productSchema = z.object({
    name : z.string({message : "PRODUCT_NAME_REQUIRED"}).trim().min(1,{message : "PRODUCT_NAME_REQUIRED"}).max(150 , {message:"PRODUCT_NAME_TOO_LONG"}) ,
    sku : z.string({message : "PRODUCT_SKU_REQUIRED"}).trim().min(1,{message : "PRODUCT_SKU_REQUIRED"}).max(50 ,{message : "PRODUCT_SKU_TOO_LONG"}) ,
    price : z.coerce.number({message :"PRODUCT_PRICE_REQUIRED"}).min(0 , {message : "PRODUCT_PRICE_INVALID"}) ,
    stock : z.coerce.number({message :"PRODUCT_STOCK_REQUIRED"}).int().min(0 , {message : "PRODUCT_STOCK_INVALID"}) ,
    category : z.string().trim().max(100 , { message :"PRODUCT_CATEGORY_TOO_LONG"}).optional() ,
})

const idParamSchema = z.object({
    id : z.string({message : "ID_REQUIRED"}).trim().min(1,{message : "ID_REQUIRED"}).regex(/^\d+$/,{message : "ID_INVALID"})
        .transform(Number).refine(id => id >= 1,{message : "ID_INVALID"})
}) ; 

module.exports = {
    productSchema ,
    idParamSchema
} ;
