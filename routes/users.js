const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Collection = require('../models/Collection');

const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');
const statusCode = require('../utils/status-code');

// 회원가입
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

// 로그인 (userId 이용)
router.post('/signin', asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  
  if (!user) {
    return res.status(statusCode.NOT_FOUND).json({error: "존재하지 않는 회원입니다."});
  }
  
  if (user.password !== hashPassword(password)) {
    return res.status(statusCode.NOT_FOUND).json({error: "비밀번호가 일치하지 않습니다."});
  }
  
  res.json({
    message: '로그인 성공',
    userId: user._id
  });
  
}));

// 로그인 (토큰 + 쿠키)
router.post('/signin/token', asyncHandler(async (req, res) => {
  passport.authenticate('local', {session: false}, (err, user) => {
      if (err) {
          return res.status(statusCode.BAD_REQUEST).json({
              error: '토큰 발급 에러 발생',
              user   : user
          });
      }
      if (!user) {
          return res.status(statusCode.BAD_REQUEST).json({
              error: '해당 사용자 없음',
              user   : user
          });
      }
      req.login(user, {session: false}, (err) => {
          if (err) {
              res.send(err);
          }
          // 유저 jwt 생성 - jwt.sign('token 내용', 'JWT secretkey')
          const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1 year'});
          // 토큰 쿠키로 전달
          res.cookie('token', token);
          return res.json({user, token});
      });
  })(req, res);
}));

// 로그아웃 (쿠키 삭제)
router.post('/logout', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {
  res.cookie('token', null, {
    maxAge: 0,
  });
  res.json({message: '로그아웃 성공'});
}));

// 회원 탈퇴
router.delete('/delete', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {
  const user = req.user;
  // 내가 만든 컬렉션만 삭제
  await Collection.deleteMany({ user: user._id });
  // 게시물, 댓글의 user를 null로
  const posts = await Post.find({ user: user._id });
  posts.map(async (post) => {
      post.user = null;
      await post.save();
  });
  const comments = await Comment.find({ user: user._id });
  comments.map(async (comment) => {
      comment.user = null;
      await comment.save();
  });
  await User.deleteOne(user);

  // 쿠키 삭제
  res.cookie('token', null, {
    maxAge: 0,
  });
  res.json({message: '탈퇴 성공'});
}))

// 중복 확인
router.get('/validate/email/:email', asyncHandler(async(req, res) => {
  const email = req.params.email;
  if(await User.exists({email})) {
    return res.status(statusCode.CONFLICT).json({error: "이미 사용 중인 이메일입니다."});
  }
  res.json({message: "사용 가능한 이메일입니다."});
}))

router.get('/validate/nickname/:nickname', asyncHandler(async(req, res) => {
  const nickname = req.params.nickname;
  if(await User.exists({nickname})) {
    return res.status(statusCode.CONFLICT).json({error: "이미 사용 중인 닉네임입니다."});
  }
  res.json({message: "사용 가능한 닉네임입니다."});
}))

// 프로필 조회
router.get('/profile', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {
  const user = req.user;
  res.json({user: {
    email: user.email,
    nickname: user.nickname,
    profileImage: user.profileImage,
    introduction: user.introduction,
  }});
}))

// 프로필 변경
router.put('/profile', passport.authenticate('jwt', {session: false}), asyncHandler(async(req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    {_id: user._id},
    {
      profileImage: req.body.profileImage,
      email: req.body.email,
      nickname: req.body.nickname,
      introduction: req.body.introduction
    }
  );

  res.json({message: '프로필 변경이 완료되었습니다.'});
}))

// 비밀번호 변경
router.put('/profile/password', passport.authenticate('jwt', {session: false}), asyncHandler(async(req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    {_id: user._id},
    {password: hashPassword(req.body.password)}
  );

  res.json({message: '비밀번호 변경이 완료되었습니다.'});
}))


// 마이페이지 (내가 쓴 글)
router.get('/posts', passport.authenticate('jwt', {session: false}), asyncHandler(async(req, res) => {
  const user = req.user;

  if (!await User.exists({ _id: user._id })) {
    return res.status(statusCode.NOT_FOUND).json({error: "존재하지 않는 회원입니다."});
  }

  const posts = await Post.find({user: user._id})
    .populate('user', 'nickname profileImage introduction')
    .sort({createdAt: -1})
    .lean();

  res.json(await Promise.all(
    posts.map(async(post) => {   
        let likeState = false;
        let scrap = false;

        // 유저의 좋아요 여부
        if (await Like.exists({user: user._id, post: post})) {
            likeState = true;
        }

        // 유저의 스크랩 여부
        if (await Collection.exists({user: user._id, posts: post})) {
            scrap = true;
        }

        return {post, likeState, scrap};
    })
  ));
}))

// 내가 쓴 댓글
router.get('/comments', passport.authenticate('jwt', {session: false}), asyncHandler(async(req, res) => {
  const user = req.user;

  if (!await User.exists({ _id: user._id })) {
    return res.status(statusCode.NOT_FOUND).json({error: "존재하지 않는 회원입니다."});
  }

  const comments = await Comment.find({user: user._id})
    .populate('post', 'title')
    .sort({createdAt: -1})
    .lean();
  res.json(comments);
}))

// 내가 스크랩한 글
router.get('/scraps', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {
  const user = req.user;

  if (!await User.exists({ _id: user._id })) {
    return res.status(statusCode.NOT_FOUND).json({error: "존재하지 않는 회원입니다."});
  }

  const collections = await Collection.find({user: user._id}).sort({createdAt: -1})
    .populate({path: 'posts', options: { sort: { 'createdAt': -1 } }, 
              populate: {path: 'user', select: 'nickname profileImage introduction'}})
    .lean();
  res.json(await Promise.all(
    collections.map(async(collection) => {
      let result = { collectionId: collection._id, name: collection.name };
      result.posts = await Promise.all(
        collection.posts.map(async(post) => {   
          let likeState = false;
          let scrap = false;
  
          // 유저의 좋아요 여부
          if (await Like.exists({user: user._id, post: post})) {
              likeState = true;
          }
  
          // 유저의 스크랩 여부
          if (await Collection.exists({user: user._id, posts: post})) {
              scrap = true;
          }
  
          return {post, likeState, scrap};
        })
      )
      return result;
    })
  ));
}));

module.exports = router;
