const { Router } = require('express');
const router = Router();
const passport = require('passport');

const Post = require('../models/Post');
const User = require('../models/User');
const Like = require('../models/Like');

const asyncHandler = require('../utils/async-handler');
const statusCode = require('../utils/status-code');

/* 좋아요 토글링 */
router.post('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async(req, res) => {
    const { postId }  = req.params;
    const user = req.user;
    let result = {};

    // 로그인 여부 확인
    if (!user) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다."});
    }

    // 회원 존재 확인
    if (!await User.exists({ _id: user._id })) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "존재하지 않는 회원입니다."});
    }

    // 게시물 존재 확인
    if (!await Post.exists({ _id: postId })) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물이 없습니다."});
    }

    const isLiked = await Like.findOne({user: user._id, post: postId});
    const post = await Post.findById(postId);

    // 해당 게시물에 좋아요 일때
    if (isLiked) {
        // 좋아요 취소하기
        await Like.findByIdAndDelete(isLiked);

        // Post 좋아요 수 업데이트
        post.likeCount--;
        await post.save();

        result = {message : "좋아요를 취소했습니다."};
    }
    // 해당 게시물에 좋아요 아닐때
    else {
        // 좋아요 누르기
        await Like.create({
            user: user._id, 
            post: postId
        });   
        
        // Post 좋아요 수 업데이트
        post.likeCount++;
        await post.save();
        
        result = {message : "좋아요를 눌렀습니다."};
    }

    return res.json(result);
}));

module.exports = router;