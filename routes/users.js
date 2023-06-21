const { Router } = require('express');
const router = Router();
const hashPassword = require('../utils/hash-password');
const User = require('../models/User');
const asyncHandler = require('../utils/async-handler');


//회원가입
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

//로그인
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

//회원 탈퇴
router.delete('/:userId/delete', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  await User.deleteOne(user);
  res.json({message: '탈퇴 성공'});
}))

//프로필 조회
router.get('/:userId/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json({user: {
    nickname: user.nickname,
    profileImage: user.profileImage,
    introduction: user.introduction,
  }});
}))

//개인정보 변경
router.put('/:userId/profile/image', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate({_id: req.params.userId}, {profileImage: req.body.profileImage});

  res.json({message: '프로필 이미지 변경이 완료되었습니다.'});
}))

router.put('/:userId/profile/email', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate({_id: req.params.userId}, {email: req.body.email});

  res.json({message: '이메일 변경이 완료되었습니다.'});
}))

router.put('/:userId/profile/nickname', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate({_id: req.params.userId}, {nickname: req.body.nickname});

  res.json({message: '닉네임 변경이 완료되었습니다.'});
}))

router.put('/:userId/profile/password', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate({_id: req.params.userId}, {password: hashPassword(req.body.password)});

  res.json({message: '비밀번호 변경이 완료되었습니다.'});
}))

router.put('/:userId/profile/introduction', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate({_id: req.params.userId}, {introduction: req.body.introduction});

  res.json({message: '소개 변경이 완료되었습니다.'});
}))

module.exports = router;
