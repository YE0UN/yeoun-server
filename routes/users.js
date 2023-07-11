const { Router } = require('express');
const router = Router();

const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Collection = require('../models/Collection');

const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');

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
  const user = await User.findOne({email});
  
  if (!user) {
    return res.status(404).json({error: "존재하지 않는 회원입니다."});
  }
  
  if (user.password !== hashPassword(password)) {
    return res.status(404).json({error: "비밀번호가 일치하지 않습니다."});
  }
  
  res.json({
    message: '로그인 성공',
    userId: user._id
  });
  
}));

//회원 탈퇴
router.delete('/:userId/delete', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  await User.deleteOne(user);
  res.json({message: '탈퇴 성공'});
}))

//중복 확인
router.get('/validate/email/:email', asyncHandler(async(req, res) => {
  const email = req.params.email;
  if(await User.exists({email})) {
    return res.status(409).json({error: "이미 사용 중인 이메일입니다."});
  }
  res.json({message: "사용 가능한 이메일입니다."});
}))

router.get('/validate/nickname/:nickname', asyncHandler(async(req, res) => {
  const nickname = req.params.nickname;
  if(await User.exists({nickname})) {
    return res.status(409).json({error: "이미 사용 중인 닉네임입니다."});
  }
  res.json({message: "사용 가능한 닉네임입니다."});
}))

//프로필 조회
router.get('/:userId/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json({user: {
    email: user.email,
    nickname: user.nickname,
    profileImage: user.profileImage,
    introduction: user.introduction,
  }});
}))

//프로필 변경
router.put('/:userId/profile', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
    {_id: req.params.userId},
    {
      profileImage: req.body.profileImage,
      email: req.body.email,
      nickname: req.body.nickname,
      introduction: req.body.introduction
    }
    );

  res.json({message: '프로필 변경이 완료되었습니다.'});
}))

//비밀번호 변경
router.put('/:userId/profile/pw', asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
    {_id: req.params.userId},
    {password: hashPassword(req.body.password)}
  );

  res.json({message: '비밀번호 변경이 완료되었습니다.'});
}))


//마이페이지
router.get('/:userId/posts', asyncHandler(async(req, res) => {
  const { userId } = req.params;

  if (!await User.exists({ _id: userId })) {
    return res.status(404).json({error: "존재하지 않는 회원입니다."});
  }

  const posts = await Post.find({user: userId}).populate('user', 'nickname profileImage introduction').sort({createdAt: -1});
  res.json(await Promise.all(
    posts.map(async(post) => {   
        let likeState = false;
        let scrap = false;

        // 유저의 좋아요 여부
        if (await Like.exists({user: userId, post: post})) {
            likeState = true;
        }

        // 유저의 스크랩 여부
        if (await Collection.exists({user: userId, posts: post})) {
            scrap = true;
        }

        return {post, likeState, scrap};
    })
  ));
}))

//댓글
router.get('/:userId/comments', asyncHandler(async(req, res) => {
  const { userId } = req.params;

  if (!await User.exists({ _id: userId })) {
    return res.status(404).json({error: "존재하지 않는 회원입니다."});
  }

  const comments = await Comment.find({user: userId}).populate('post', 'title').sort({createdAt: -1});
  res.json(comments);
}))

//스크랩
router.get('/:userId/scraps', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!await User.exists({ _id: userId })) {
    return res.status(404).json({error: "존재하지 않는 회원입니다."});
  }

  const collections = await Collection.find({user: userId})
                                        .populate({path: 'posts', options: { sort: { 'createdAt': -1 } }, 
                                                  populate: {path: 'user', select: 'nickname profileImage introduction'}});
  res.json(await Promise.all(
    collections.map(async(collection) => {
      let result = { name: collection.name };
      result.posts = await Promise.all(
        collection.posts.map(async(post) => {   
            let likeState = false;
            if (await Like.exists({user: userId, post: post})) {
                likeState = true;
            }
            return {post, likeState};
        })
      )
      return result;
    })
  ));
}));

module.exports = router;
