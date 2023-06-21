var express = require('express');
var router = express.Router();
const hashPassword = require('../utils/hash-password');
const User = require('../models/User');

router.post('/signup', async (req, res, next) => {
  const {email, password, nickname, introduction, profileImage} = req.body;
  const hashedPassword = hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    nickname,
    introduction,
    profileImage,
  });

  console.log('회원가입 완료', user);

  res.send({message: '회원가입을 완료했습니다.'})
});

router.post('/signin', async (req, res, next) => {
  const {email, password} = req.body;
  const user = User.findOne({ email });
  if (!user) {
    throw new Error('존재하지 않는 회원입니다.');
  }
  if (user.password !== hashPassword(password)) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  res.send({message: '로그인 성공!'});
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
