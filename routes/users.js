const { Router } = require('express');
const router = Router();
const hashPassword = require('../utils/hash-password');
const User = require('../models/User');
const asyncHandler = require('../utils/async-handler');

router.post('/signup', asyncHandler(async (req, res) => {
  const {email, password, nickname} = req.body;
  const hashedPassword = hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword,
    nickname,
  });
  
  res.json({message: '회원가입을 완료했습니다.'})
}));

router.post('/signin', asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  const user = User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({error: "존재하지 않는 회원입니다."});
  }
  
  if (user.password !== hashPassword(password)) {
    return res.status(404).json({error: "비밀번호가 일치하지 않습니다."});
  }
  
  res.json({message: '로그인 성공'});
  
}));

router.delete('/:userId/delete', asyncHandler(async (req, res) => {
  const user = User.findById(req.params.userId);
  await User.deleteOne(user);
  res.json({message: '탈퇴 성공'});
}))

module.exports = router;
