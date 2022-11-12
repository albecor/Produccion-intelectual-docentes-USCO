const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
const methodOverride = require("method-override") ////usado para poder hacer el delete y put en html
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('passport');
var hbs = require('handlebars');

//Initializations
const app = express()
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs' 
}));
app.set('view engine', '.hbs'); 


//Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false})); //Cada vez que un formulario envie datos, los envía en formato json

app.use(express.json());
app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(express.static('public'))
app.use(session({
    secret: '=f9l6c4b2/',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');    
    res.locals.user = req.user || null; ////guarda el usuario que ha ingresado!!         
    next(); 
}); 

//Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/publications.routes'));
app.use(require('./routes/reports.routes'));

//Static files
app.use(express.static(path.join(__dirname, 'public'))); //Indica a express donde esta la carpeta pública

//Helpers

hbs.registerHelper("orx", function (v1, v2, options) {
    return (v1 || v2) ? options.fn(this) : options.inverse(this);
});


module.exports = app;