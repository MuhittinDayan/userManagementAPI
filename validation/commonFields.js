const {z} = require("zod") ;

const userDataSchema = z.object({
    name : z.string().trim().min(1).max(100) ,
    email : z.string().trim().email() ,
    age : z.coerce.number().int().min(18).max(120) ,
    tcNo : z.string().trim().regex(/^[1-9]\d{10}$/)
});

const idParamSchema = z.object({
    id :z.coerce.number().min(1).int()
}) ;

module.exports = {
    userDataSchema ,
    idParamSchema
} ;