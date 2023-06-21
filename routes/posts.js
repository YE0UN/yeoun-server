const { Router } = require('express');
const router = Router();

const Post = require('../models/Post');
const User = require('../models/User');

/* 모든 게시물 보기 + 지역별, 검색, 정렬 */
router.get('/', async (req, res) =>{
    
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
            }).sort({
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
        });
        return res.json(result);
    }
    // 지역별
    if (siDo) {
        // + 정렬
        if (sort) {
            const result = await Post.find({
                siDo: siDo,
            }).sort({
                // 일단 최신순만
                createdAt: -1
            });
            return res.json(result);
        }
        const result = await Post.find({
            siDo: siDo,
        });
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
            }).sort({
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
        });
        return res.json(result);
    }
    // 정렬 (최신순, 인기순, 댓글순)
    if (sort) {}
    // 모든 게시물 (기본 최신순)
    const result = await Post.find().sort({createdAt: -1});
    return res.json(result);
});

// 특정 게시물 보기
router.get('/:postId', async (req, res) =>{
    const result = await Post.findById(req.params.postId);
    // 게시물 찾기 실패
    if (!result) {
        res.status(404);
        return res.json({error: "해당 게시물 없음"});
    }
    return res.json(result);
}); 

// 게시물 작성하기
router.post('/', async (req, res) =>{
    // 로그인 안 되어있으면 로그인하게끔
    // const author = await User.find({
    //     _id: req.user.userId,
    // })

    const { siDo, title, content, img } = req.body;
    
    // 필수 작성 validation
    if (!siDo) {
        res.status(400);
        return res.json({error: "지역을 선택하세요"});
    }
    if (!content) {
        res.status(400);
        return res.json({error: "내용을 입력하세요"});
    }

    const post = await Post.create({
        siDo,
        title,
        content,
        img,
        //author,
    });

    const result = await post.save();
    return res.json(result);
}); 

// 게시물 수정하기
router.put('/:postId', async (req, res) =>{
    // 로그인한 유저인지
    
    const post = await Post.findById(req.params.postId);
    
    // 게시물 찾기 실패
    if (!post) {
        res.status(404);
        return res.json({error: "해당 게시물 없음"});
    }
    // 필수 작성 validation
    if (!req.body.siDo) {
        res.status(400);
        return res.json({error: "지역을 선택하세요"});
    }
    if (!req.body.content) {
        res.status(400);
        return res.json({error: "내용을 입력하세요"});
    }

    post.siDo = req.body.siDo;
    post.title = req.body.title;
    post.img = req.body.img;
    post.content = req.body.content;
    result = await post.save();
    return res.json(result);
});

// 게시물 삭제하기 
router.delete('/:postId', async (req, res) =>{
    // 로그인한 유저인지
    result = await Post.findByIdAndDelete(req.params.postId);
    return res.json({message: "삭제 완료"});
}); 

module.exports = router;