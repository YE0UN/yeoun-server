const { Router } = require('express');
const router = Router();

const Post = require('../models/Post');
const User = require('../models/User');

const asyncHandler = require('../utils/async-handler');
const statusCode = require('../utils/status-code');

/* 모든 게시물 보기 + 지역별, 검색, 정렬 */
router.get('/', asyncHandler(async (req, res) =>{
    
    // 댓글 수, 좋아요 수에 써먹을 수 있을 듯
    // const count_board = await Board.countDocuments();
    
    const {siDo, keyword, sort} = req.query;
    
    // 지역별 & 검색별
    if (siDo && keyword) {
        // + 정렬
        if (sort) {
            const result = await Post.find({
                siDo: siDo,
                $or: [
                    // i: 대소문자 구별X
                    { title: {$regex: new RegExp(`${keyword}`, "i"), } },
                    { content: {$regex: new RegExp(`${keyword}`, "i"), } }
                ],
            })
            .populate('user', 'nickname profileImage')
            .sort({
                // 일단 최신순만
                createdAt: -1
            });
            return res.json(result);
        }
        const result = await Post.find({
            siDo: siDo,
            $or: [
                // i: 대소문자 구별X
                { title: {$regex: new RegExp(`${keyword}`, "i"), } },
                { content: {$regex: new RegExp(`${keyword}`, "i"), } }
            ],
        }).populate('user', 'nickname profileImage');
        return res.json(result);
    }
    // 지역별
    if (siDo) {
        // + 정렬
        if (sort) {
            const result = await Post.find({
                siDo: siDo,
            })
            .populate('user', 'nickname profileImage')
            .sort({
                // 일단 최신순만
                createdAt: -1
            });
            return res.json(result);
        }
        const result = await Post.find({
            siDo: siDo,
        }).populate('user', 'nickname profileImage');
        return res.json(result);
    }
    // 검색별
    if (keyword) {
        // + 정렬
        if (sort) {
            const result = await Post.find({
                $or: [
                    // i: 대소문자 구별X
                    { title: {$regex: new RegExp(`${keyword}`, "i"), } },
                    { content: {$regex: new RegExp(`${keyword}`, "i"), } }
                ],
            })
            .populate('user', 'nickname profileImage')
            .sort({
                // 일단 최신순만
                createdAt: -1
            });
            return res.json(result);
        }
        const result = await Post.find({
            $or: [
                // i: 대소문자 구별X
                { title: {$regex: new RegExp(`${keyword}`, "i"), } },
                { content: {$regex: new RegExp(`${keyword}`, "i"), } }
            ],
        }).populate('user', 'nickname profileImage');
        return res.json(result);
    }
    // 정렬 (최신순, 인기순, 댓글순)
    if (sort) {}
    // 모든 게시물
    const result = await Post.find().populate('user', 'nickname profileImage');
    res.json(result);
}));

/* 특정 게시물 보기 */
router.get('/:postId', asyncHandler(async (req, res) =>{
    const result = await Post.findById(req.params.postId)
                                .populate('user', 'nickname profileImage');
    // 게시물 찾기 실패
    if (!result) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물 없음"});
    }
    res.json(result);
})); 

/* 게시물 작성하기 */
router.post('/', asyncHandler(async (req, res) =>{
    // 로그인 여부 확인
    const user = await User.findById(req.body.userId);
    if (!user) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다"});
    }

    const { siDo, title, content, img } = req.body;
    
    // 필수 작성 validation
    if (!siDo) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "지역을 선택하세요"});
    }
    if (!content) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "내용을 입력하세요"});
    }

    const post = await Post.create({
        siDo,
        title,
        content,
        img,
        user,
    });

    console.log('게시물 작성 완료', post);
    res.json(post);
})); 

/* 게시물 수정하기 */
router.put('/:postId', asyncHandler(async (req, res) =>{
    
    const post = await Post.findById(req.params.postId).populate('user');
    // 게시물 찾기 실패
    if (!post) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물 없음"});
    }

    const user = await User.findById(req.body.userId);
    // 로그인 여부 확인
    if (!user) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다"});
    }
    // 게시물 작성자와 로그인 유저와 일치하는지
    if (!post.user._id.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "수정할 수 없음"});
    }

    // 필수 작성 validation
    if (!req.body.siDo) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "지역을 선택하세요"});
    }
    if (!req.body.content) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "내용을 입력하세요"});
    }

    post.siDo = req.body.siDo;
    post.title = req.body.title;
    post.img = req.body.img;
    post.content = req.body.content;
    
    result = await post.save();
    console.log('게시물 수정 완료', result);
    res.json(result);
}));

/* 게시물 삭제하기 */ 
router.delete('/:postId', asyncHandler(async (req, res) =>{

    const post = await Post.findById(req.params.postId).populate('user');
    // 게시물 찾기 실패
    if (!post) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물 없음"});
    }

    const user = await User.findById(req.body.userId);
    // 로그인 여부 확인
    if (!user) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다"});
    }
    
    // 게시물 작성자와 로그인 유저와 일치하는지
    if (!post.user._id.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "삭제할 수 없음"});
    }

    const result = await Post.deleteOne(post);
    console.log('게시물 삭제 완료', result);
    res.json({message: "삭제 완료"});
})); 

module.exports = router;