require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Conecta ao banco de dados
const dbConn = require('./config/database')

const expressSession = require('express-session')
const pgSession = require('connect-pg-simple')(expressSession)

var app = express();

const helmet = require('helmet')
app.use(helmet()) // faz parte das configurações padrao do helmet. Ativa as principais proteções
app.use(helmet.hidePoweredBy())

const sessionConfig = {
  store: new pgSession({
    pool: dbConn
  }),
  name: '$DATA$',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    //secure: true,   // retirado para fazer funcionar . O fausto explicou mas eu não entendi nada 
    httpOnly: true
  }
}

// Se for ambiente de produçõa, habilita confiança no primeiro proy
// e cookies seguros

if(app.get('env')  === 'production') {
  app.set('trust proxy', 1)
  sessionConfig.cookie.secure = true
}

app.use(expressSession(sessionConfig))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
