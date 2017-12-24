const express = require('express');
const env = require('./env');
const auth = require('http-auth');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('csurf');


const index = require('./routes/web');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Basic 認証
 */
// Configure basic auth
const basic = auth.basic({
    realm: 'SUPER SECRET STUFF'
}, function(username, password, callback) {
    callback(username == env.auth.username && password == env.auth.password);
});
// Create middleware that can be used to protect routes with basic auth
const authMiddleware = auth.connect(basic);

if(env.auth.valid){
    app.use('/', authMiddleware,index);
}else{
    app.use('/', index);
}


// catch 404 and forward to error handler
app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next)=>{
    if ( err.code !== undefined && err.code !== 'EBADCSRFTOKEN') return next(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
