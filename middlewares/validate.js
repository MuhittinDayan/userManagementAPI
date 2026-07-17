const validate = (schema,source) =>{
    return (req,res,next) =>{
        const result = schema.safeParse(req[source]) ;
        
        if(!result.success){
            const key = result.error.issues[0].message ;
            const error = new Error(req.t(key)) ;
            error.statusCode = 422 ;
            return next(error) ;
        }
        
        req[source] = result.data ;
        next() ;
    }
}

module.exports = {validate} ;