var createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

const app = express();

// mongoose setup
mongoose.connect('mongodb+srv://yeoun:kgw469Q3t7riuXPe@yeoun.fbf0laa.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
})

// cors 처리
app.use(express.json());
app.use(cors({ origin: '*' }));

// 파싱 허용 용량
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.send("OK");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../yeoun-client/build')));

app.use('/posts', postsRouter);
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

// 리액트로 라우팅 넘김
app.get('/', (res, req) => {
  req.sendFile(path.join(__dirname, '../yeoun-client/build/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../yeoun-client/build/index.html'));
});

module.exports = app;
