const i18next = require("i18next") ;
const middleware = require("i18next-http-middleware") ;
const Backend = require("i18next-fs-backend");


i18next.use(Backend) ;

i18next.use(middleware.LanguageDetector).init({
    preload : ["en","tr"] ,
    fallbackLng : ["en"] ,
    supportedLngs : ["en","tr"] ,
    ns : ["translation"] ,
    defaultNS : "translation" ,
    backend : {
        loadPath: __dirname + "/../locales/{{lng}}/{{ns}}.json"
    } 
}) ;

module.exports = {
    i18next,middleware
} ;