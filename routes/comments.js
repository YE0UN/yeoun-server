const { Router } = require('express');
const router = Router();
const passport = require('passport');

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const asyncHandler = require('../utils/async-handler');
const statusCode = require('../utils/status-code');

/* 댓글 작성하기 */
router.post('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {

    const { content } = req.body;
    const { postId } = req.params;
    const user = req.user;

    const post = await Post.findById(postId);
    // 게시물 찾기 실패
    if (!post) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물 없음"});
    }

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

    // 필수 작성 validation + 공백 막기
    if (!content.trim()) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "내용을 입력하세요."});
    }

    const comment = await Comment.create({
        content,
        user: user._id,
        post: postId,
    });

    // Post 댓글 업데이트
    post.comments.push(comment);
    post.commentCount++;
    await post.save();

    console.log('댓글 작성 완료');
    res.json(post);

}));

/* 댓글 삭제하기 */
router.delete('/:commentId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const user = req.user;

    const comment = await Comment.findById(commentId);
    // 댓글 찾기 실패
    if (!comment) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 댓글 없음"});
    }

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

    // 댓글 작성자와 로그인 유저 일치하는지
    if (!comment.user.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "삭제할 수 없음"});
    }

    // Post 댓글 업데이트
    const post = await Post.findById(comment.post._id);
    post.comments.splice(post.comments.indexOf(commentId), 1);
    post.commentCount--;
    await post.save();

    // Comment에서 댓글 삭제
    await Comment.deleteOne(comment);
    
    console.log('댓글 삭제 완료');
    res.json(post);
}));

module.exports = router;