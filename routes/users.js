var express = require('express');
var router = express.Router();
const hashPassword = require('../utils/hash-password');
const {User} = require('../models/User');

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
