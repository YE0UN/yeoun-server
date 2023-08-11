var createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./config/passport');
require('dotenv').config();

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');
const collectionsRouter = require('./routes/scrap/collections');
const scrapsRouter = require('./routes/scrap/scraps');
const tourRouter = require('./routes/tours');

const app = express();

// mongoose setup
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
})

// 파싱 허용 용량
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: false}));

// cors 처리
app.use(cors({
  origin: "http://localhost:3000",  // 접근 권한을 부여하는 도메인
  credentials: true,                // 요청에 쿠키 포함시키도록 허용
  allowedHeaders: "Content-Type"    // 허용할 HTTP 헤더 지정
}));

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
app.use(passport.initialize());
passportConfig();

app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);
app.use('/collections', collectionsRouter);
app.use('/scraps', scrapsRouter);
app.use('/tours', tourRouter);

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
