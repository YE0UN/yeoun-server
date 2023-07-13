const { Router } = require('express');
const router = Router();

const Post = require('../models/Post');
const Like = require('../models/Like');

const asyncHandler = require('../utils/async-handler');

/* 좋아요 토글링 */
router.post('/:postId', asyncHandler(async(req, res) => {
    const { userId } = req.body;
    const { postId }  = req.params;
    let result = {};
    const isLiked = await Like.findOne({user: userId, post: postId});
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
            user: userId, 
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