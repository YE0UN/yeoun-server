const { Router } = require('express');
const router = Router();

const Post = require('../models/Post');

const asyncHandler = require('../utils/async-handler');

/* 지역별 인기도 */
router.get('/', asyncHandler(async (req, res) => {
    const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];

    // 지역별 게시물 수 + 좋아요 수 + 댓글 수
    const result = await Promise.all(
        regions.map(async(region) => {
            const posts = await Post.find({region});
            const postCount = posts.length;
            let likeCount = 0;
            let commentCount = 0;
            posts.map((post) => {
                likeCount += post.likeCount;
                commentCount += post.commentCount;
            });
            return {[region]: postCount + likeCount + commentCount};
        }
    ));

    res.json(result);
}));

module.exports = router;