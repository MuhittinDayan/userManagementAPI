const validate = (schema,source) =>{
    return (req,res,next) =>{
        const result = schema.safeParse(req[source]) ;
        
        if(!result.success){
            const error = new Error(result.error.issues[0].message) ;
            error.statusCode = 422 ;
            return next(error) ;
        }
        
        req[source] = result.data ;
        next() ;
    }
}

module.exports = {validate} ;