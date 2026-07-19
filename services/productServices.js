const db = require("../config/db") ;


const createProductService = async(productData) =>{
    const {name,sku,price,stock,category} = productData ;

    const [skuControl] = await db.query("SELECT sku FROM products WHERE sku = ?" ,[sku]) ;
    if(skuControl.length){
        const error = new Error("PRODUCT_SKU_ALREADY_EXISTS") ;
        error.statusCode = 409 ;
        throw error 
    } ;
    
    const [result] = await db.query("INSERT INTO products(name,sku,price,stock,category) VALUES(?,?,?,?,?) " ,[name,sku,price,stock,category]) ;
    
    const newProduct = {productId : result.insertId,name,sku,price,stock,category} ;
    return newProduct ;

} ;

const getProductsService = async() =>{
    const [products] = await db.query("SELECT productId,name,sku,price,stock,category FROM products") ;

    if(!products.length){
        const error = new Error("PRODUCTS_NOT_FOUND") ;
        error.statusCode = 200 ;
        throw error ;
    }
    const productData = products.map(product =>{
        const {productId,name,sku,price,stock,category} = product ;

        return {
            productId,name,sku,price,stock,category
        }
    })
    return productData ;
} ;

const getProductByIdService = async(id) =>{
    
    const [product] = await db.query("SELECT productId,name,sku,price,stock,category FROM products WHERE productId = ? " ,[id]) ;
    if(!product.length){
        const error = new Error("PRODUCT_NOT_FOUND") ;
        error.statusCode = 404 ;
        throw error ;
    }
    const {productId,name,sku,price,stock,category} = product[0] ;
    return {
        productId,name,sku,price,stock,category
    }
} ;

const updateProductService = async(id,productData) =>{
    const {name,sku,price,stock,category} =productData ; 
    const [existingProduct] = await db.query("SELECT productId FROM products WHERE productId = ?",[id]);

    if (!existingProduct.length) {
        const error = new Error("PRODUCT_NOT_FOUND");
        error.statusCode = 404;
        throw error;
    }
    const [skuControl] = await db.query("SELECT sku FROM products WHERE sku = ? AND productId != ?" ,[sku,id]) ;
    if(skuControl.length){
        const error = new Error("PRODUCT_SKU_ALREADY_EXISTS") ;
        error.statusCode = 409 ;
        throw error 
    } ;
    await db.query("UPDATE products SET name = ? ,sku = ?,price = ? ,stock = ? ,category = ? WHERE productId = ?" ,[name,sku,price,stock,category,id]) ;
    return ;

} ;

const deleteProductService = async(id) =>{
    const [productData] = await db.query("SELECT * FROM products WHERE productId = ?",[Number(id)]);
    if(!productData.length){
        const error = new Error("PRODUCT_DELETE_NOT_FOUND");
        error.statusCode = 404 ;
        throw error ;
    }

    await db.query("DELETE FROM products WHERE productId = ? ",[id]) ;
    return ;
}
module.exports = {
    createProductService ,
    getProductsService ,
    getProductByIdService ,
    updateProductService ,
    deleteProductService
} ;
