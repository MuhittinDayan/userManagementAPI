const {z} = require("zod") ;
const {languageCodes} = require("../locales/language") ;

const aboutSchema = z.object({
    about : z.string({message : "ABOUT_TEXT_REQUIRED"}).trim().min(20 , {message : "ABOUT_TEXT_TOO_SHORT"}).max(1000 ,"ABOUT_TEXT_TOO_LONG") ,
    about_language : z.string({message : "ABOUT_LANGUAGE_REQUIRED"}).trim()
    .refine(language => languageCodes.includes(language) , {message : "ABOUT_LANGUAGE_INVALID"})
}) ;

const idParamSchema = z.object({
    id :z.coerce.number({message : "ID_REQUIRED"}).int({message :"ID_INVALID"}).min(1,{message: "ID_INVALID"})
})

module.exports = {
    aboutSchema,
    idParamSchema
} ;