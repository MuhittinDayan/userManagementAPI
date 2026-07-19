const {z} = require("zod") ;

const userDataSchema = z.object({
    name : z.string({message : "NAME_REQUIRED"}).trim().min(1, {message : "NAME_REQUIRED"}).max(100,{message : "NAME_TOO_LONG"}) ,
    email : z.string({message : "EMAIL_REQUIRED"}).trim().email({message : "EMAIL_INVALID"}) ,
    age : z.coerce.number({message : "AGE_REQUIRED"}).int().min(18, {message :"AGE_TOO_SMALL"}).max(120,{message : "AGE_TOO_LARGE"}) ,
    tcNo : z.string({message : "TC_REQUIRED"}).trim().regex(/^[1-9]\d{10}$/,{message :"TC_INVALID"})
});

const idParamSchema = z.object({
    id :z.coerce.number({message : "ID_REQUIRED"}).int({message :"ID_INVALID"}).min(1,{message: "ID_INVALID"})
}) ;

const userQuerySchema = z.object({
    search : z.string().trim().min(1,{message :"NAME_REQUIRED"}).max(100,{message : "NAME_TOO_LONG"}).optional() ,
    age : z.coerce.number().int().min(18,{message : "AGE_TOO_SMALL"}).max(120,{message : "AGE_TOO_LARGE"}).optional() ,
    minAge : z.coerce.number().int().min(18,{message : "AGE_TOO_SMALL"}).max(120,{message : "AGE_TOO_LARGE"}).optional(),
    maxAge : z.coerce.number().int().min(18,{message : "AGE_TOO_SMALL"}).max(120,{message : "AGE_TOO_LARGE"}).optional()
}) ;

module.exports = {
    userDataSchema ,
    idParamSchema ,
    userQuerySchema
} ;