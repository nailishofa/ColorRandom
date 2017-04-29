var express		= require('express'),
	path 		= require('path'),
	favicon 	= require('serve-favicon'),
	logger 		= require('morgan'),
	cookieParser    = require('cookie-parser'),
	bodyParser 	= require('body-parser'),
	io		= require('socket.io'),
	http		= require('http');
var index = require('./routes/index');
var users = require('./routes/users');

var app 	= express(),
    server	= http.Server(app);
var connections,
    io = io(server);

setInterval(function(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    var color2 = '#';
    var boxes = [];
    var x = Math.floor((Math.random() * 25) + 1);
    
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
        color2 += letters[Math.floor(Math.random() * 16)];
    }	
    for (i = 0; i < x; i++){
        boxes.push(color);
    } for (i = x; i < 25;i++){
        boxes.push(color2);
    }
    var currentIndex = boxes.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = boxes[currentIndex];
        boxes[currentIndex] = boxes[randomIndex];
        boxes[randomIndex] = temporaryValue;
    }
    io.emit('box',{'boxes':boxes});
}, 5000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = {app:app, server:server};
//module.exports = app;