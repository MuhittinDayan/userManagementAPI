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

const userQuerySchema = z.object({
    search : z.string().trim().min(1).max(100).optional() ,
    age : z.coerce.number().int().min(18).max(120).optional() ,
    minAge : z.coerce.number().int().min(18).max(120).optional(),
    maxAge : z.coerce.number().int().min(18).max(120).optional()
}) ;

module.exports = {
    userDataSchema ,
    idParamSchema ,
    userQuerySchema
} ;