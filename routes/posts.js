const { Router } = require('express');
const router = Router();
const passport = require('passport');

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Collection = require('../models/Collection');

const asyncHandler = require('../utils/async-handler');
const statusCode = require('../utils/status-code');

/* 모든 게시물 보기 + 지역별, 검색, 정렬 */
router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), asyncHandler(async (req, res) => {
    
    const userId = req.user ? req.user._id : null;
    let posts, result;
    const {region, keyword, sort} = req.query;
    
    const page = Number(req.query.page || 1);
    const currentPage = page;
    const perPage = 9;
    let countPosts, maxPage;

    // 페이지 범위 미달
    if (page < 1) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "페이지 없음"});
    }
    
    // 지역 선택 시 빈 값일 때
    if (region === '') {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "지역이 선택되지 않음"});
    }

    // 지역별 & 검색별
    if (region && keyword) {
        // + 정렬
        if (sort) {
            countPosts = await Post.countDocuments({
                region: region,
                $or: [
                    {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                    {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                ],
            });
            maxPage = Math.ceil(countPosts / perPage);
            // 페이지 범위 초과
            if (page > maxPage) {
                res.status(statusCode.BAD_REQUEST);
                return res.json({error: "페이지 없음"});
            }

            switch (sort) {
                case "createdAt": 
                    posts = await Post.find({
                        region: region,
                        $or: [
                            // i: 대소문자 구별X
                            {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                            {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                        ],
                    }).populate('user', 'nickname profileImage introduction').sort({createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
                    
                case "comment":
                    posts = await Post.find({
                        region: region,
                        $or: [
                            {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                            {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                        ],
                    }).populate('user', 'nickname profileImage introduction').sort({commentCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
    
                case "like":
                    posts = await Post.find({
                        region: region,
                        $or: [
                            {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                            {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                        ],
                    }).populate('user', 'nickname profileImage introduction').sort({likeCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
            }
            result = await Promise.all(
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
            );
            result.push({currentPage, maxPage});
            return res.json(result);
        }
        countPosts = await Post.countDocuments({
            region: region,
            $or: [
                {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                {content: {$regex: new RegExp(`${keyword}`, "i"), }}
            ],
        });
        maxPage = Math.ceil(countPosts / perPage);
        // 페이지 범위 초과
        if (page > maxPage) {
            res.status(statusCode.BAD_REQUEST);
            return res.json({error: "페이지 없음"});
        } 

        posts = await Post.find({
            region: region,
            $or: [
                {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                {content: {$regex: new RegExp(`${keyword}`, "i"), }}
            ],
        }).populate('user', 'nickname profileImage introduction').skip((page - 1) * perPage).limit(perPage);       
        result = await Promise.all(
            posts.map(async(post) => {
    
                let likeState = false;
                let scrap = false;

                if (await Like.exists({user: userId, post: post})) {
                    likeState = true;
                }
                if (await Collection.exists({user: userId, posts: post})) {
                    scrap = true;
                }

                return {post, likeState, scrap};
            })
        );
        result.push({currentPage, maxPage});
        return res.json(result);
    }
    // 지역별
    if (region) {
        // + 정렬
        if (sort) {
            countPosts = await Post.countDocuments({
                region: region,
            });
            maxPage = Math.ceil(countPosts / perPage);
            // 페이지 범위 초과
            if (page > maxPage) {
                res.status(statusCode.BAD_REQUEST);
                return res.json({error: "페이지 없음"});
            }

            switch (sort) {
                case "createdAt": 
                    posts = await Post.find({
                        region: region,
                    }).populate('user', 'nickname profileImage introduction').sort({createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
                    
                case "comment":
                    posts = await Post.find({
                        region: region,
                    }).populate('user', 'nickname profileImage introduction').sort({commentCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
    
                case "like":
                    posts = await Post.find({
                        region: region,
                    }).populate('user', 'nickname profileImage introduction').sort({likeCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
            }
            result = await Promise.all(
                posts.map(async(post) => {
        
                    let likeState = false;
                    let scrap = false;

                    if (await Like.exists({user: userId, post: post})) {
                        likeState = true;
                    }
                    if (await Collection.exists({user: userId, posts: post})) {
                        scrap = true;
                    }

                    return {post, likeState, scrap};
                })
            );
            result.push({currentPage, maxPage});
            return res.json(result);
        }
        countPosts = await Post.countDocuments({
            region: region,
        });
        maxPage = Math.ceil(countPosts / perPage);
        // 페이지 범위 초과
        if (page > maxPage) {
            res.status(statusCode.BAD_REQUEST);
            return res.json({error: "페이지 없음"});
        }

        posts = await Post.find({
            region: region,
        }).populate('user', 'nickname profileImage introduction').skip((page - 1) * perPage).limit(perPage);
        result = await Promise.all(
            posts.map(async(post) => {
    
                let likeState = false;
                let scrap = false;

                if (await Like.exists({user: userId, post: post})) {
                    likeState = true;
                }
                if (await Collection.exists({user: userId, posts: post})) {
                    scrap = true;
                }

                return {post, likeState, scrap};
            })
        );
        result.push({currentPage, maxPage});
        return res.json(result);
    }
    // 검색별
    if (keyword) {
        // + 정렬
        if (sort) {
            countPosts = await Post.countDocuments({
                $or: [
                    {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                    {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                ],
            });
            maxPage = Math.ceil(countPosts / perPage);
            // 페이지 범위 초과
            if (page > maxPage) {
                res.status(statusCode.BAD_REQUEST);
                return res.json({error: "페이지 없음"});
            }

            switch (sort) {
                case "createdAt": 
                    posts = await Post.find({
                        $or: [
                            {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                            {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                        ],
                    }).populate('user', 'nickname profileImage introduction').sort({createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
                    
                case "comment":
                    posts = await Post.find({
                        $or: [
                            {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                            {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                        ],
                    }).populate('user', 'nickname profileImage introduction').sort({commentCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
    
                case "like":
                    posts = await Post.find({
                        $or: [
                            {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                            {content: {$regex: new RegExp(`${keyword}`, "i"), }}
                        ],
                    }).populate('user', 'nickname profileImage introduction').sort({likeCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                    break;
            }
            result = await Promise.all(
                posts.map(async(post) => {
        
                    let likeState = false;
                    let scrap = false;

                    if (await Like.exists({user: userId, post: post})) {
                        likeState = true;
                    }
                    if (await Collection.exists({user: userId, posts: post})) {
                        scrap = true;
                    }

                    return {post, likeState, scrap};
                })
            );
            result.push({currentPage, maxPage});
            return res.json(result);
        }
        countPosts = await Post.countDocuments({
            $or: [
                {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                {content: {$regex: new RegExp(`${keyword}`, "i"), }}
            ],
        });
        maxPage = Math.ceil(countPosts / perPage);
        // 페이지 범위 초과
        if (page > maxPage) {
            res.status(statusCode.BAD_REQUEST);
            return res.json({error: "페이지 없음"});
        }

        posts = await Post.find({
            $or: [
                {title: {$regex: new RegExp(`${keyword}`, "i"), }},
                {content: {$regex: new RegExp(`${keyword}`, "i"), }}
            ],
        }).populate('user', 'nickname profileImage introduction').skip((page - 1) * perPage).limit(perPage);
        result = await Promise.all(
            posts.map(async(post) => {
    
                let likeState = false;
                let scrap = false;

                if (await Like.exists({user: userId, post: post})) {
                    likeState = true;
                }
                if (await Collection.exists({user: userId, posts: post})) {
                    scrap = true;
                }

                return {post, likeState, scrap};
            })
        );
        result.push({currentPage, maxPage});
        return res.json(result);
    }
    // 정렬 (최신순, 인기순, 댓글순)
    if (sort) {
        countPosts = await Post.countDocuments();
        maxPage = Math.ceil(countPosts / perPage);
        // 페이지 범위 초과
        if (page > maxPage) {
            res.status(statusCode.BAD_REQUEST);
            return res.json({error: "페이지 없음"});
        }

        switch (sort) {
            case "createdAt": 
                posts = await Post.find().populate('user', 'nickname profileImage introduction').sort({createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                break;
                
            case "comment":
                posts = await Post.find().populate('user', 'nickname profileImage introduction').sort({commentCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                break;

            case "like":
                posts = await Post.find().populate('user', 'nickname profileImage introduction').sort({likeCount: -1, createdAt: -1}).skip((page - 1) * perPage).limit(perPage);
                break;
        }
        result = await Promise.all(
            posts.map(async(post) => {
    
                let likeState = false;
                let scrap = false;

                if (await Like.exists({user: userId, post: post})) {
                    likeState = true;
                }
                if (await Collection.exists({user: userId, posts: post})) {
                    scrap = true;
                }
    
                return {post, likeState, scrap};
            })
        );
        result.push({currentPage, maxPage});
        return res.json(result);
    }
    // 모든 게시물 
    countPosts = await Post.countDocuments();
    maxPage = Math.ceil(countPosts / perPage);
    // 페이지 범위 초과
    if (page > maxPage) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "페이지 없음"});
    }

    posts = await Post.find().populate('user', 'nickname profileImage introduction').skip((page - 1) * perPage).limit(perPage);
    result = await Promise.all(
        posts.map(async(post) => {   
            let likeState = false;
            let scrap = false;
            
            if (await Like.exists({user: userId, post: post})) {
                likeState = true;
            }
            if (await Collection.exists({user: userId, posts: post})) {
                scrap = true;
            }

            return {post, likeState, scrap};
        })
    );
    result.push({currentPage, maxPage});
    res.json(result);
}));

/* 특정 게시물 보기 */
router.get('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;
    let likeState = false;
    let scrap = false;

    const post = await Post.findById(postId)
                                .populate('user', 'nickname profileImage introduction')
                                .populate({
                                    path: 'comments',
                                    select: 'content createdAt',
                                    populate: {
                                        path: 'user',
                                        select: 'nickname profileImage introduction'
                                    }
                                });
    // 게시물 찾기 실패
    if (!post) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물 없음"});
    }

    // 유저의 좋아요 여부
    if (await Like.exists({user: user._id, post: postId})) {
        likeState = true;
    }

    // 유저의 스크랩 여부
    if (await Collection.exists({user: user._id, posts: post})) {
        scrap = true;
    }

    res.json({post, likeState, scrap});
})); 

/* 게시물 작성하기 */
router.post('/', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {

    const { region, title, content, img } = req.body;
    const user = req.user;

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
    if (!region) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "지역을 선택하세요."});
    }
    if (!content.trim()) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "내용을 입력하세요."});
    }

    const post = await Post.create({
        region,
        title,
        content,
        img,
        user: user._id,
    });

    console.log('게시물 작성 완료');
    res.json(post);
})); 

/* 게시물 수정하기 */
router.put('/:postId', passport.authenticate('jwt', {session: false}),  asyncHandler(async (req, res) => {
    
    const { region, title, content, img } = req.body;
    const user = req.user;

    const post = await Post.findById(req.params.postId);
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

    // 게시물 작성자와 로그인 유저 일치하는지
    if (!post.user.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "수정할 권한이 없습니다."});
    }

    // 필수 작성 validation + 공백 막기
    if (!region) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "지역을 선택하세요."});
    }
    if (!content.trim()) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "내용을 입력하세요."});
    }

    post.region = region;
    post.title = title;
    post.img = img;
    post.content = content;
    
    await post.save();
    console.log('게시물 수정 완료');
    res.json(post);
}));

/* 게시물 삭제하기 */ 
router.delete('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {

    const { postId } = req.params;
    const post = await Post.findById(postId);
    // 게시물 찾기 실패
    if (!post) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 게시물 없음"});
    }

    const user = req.user;
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

    // 게시물 작성자와 로그인 유저 일치하는지
    if (!post.user.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "삭제할 권한이 없습니다."});
    }

    // 관련 댓글, 좋아요, 스크랩 삭제
    await Comment.deleteMany({ post: post });
    await Like.deleteMany({ post: post });
    const collections = await Collection.find({ posts: post });
    collections.map(async (collection) => {
        collection.posts.splice(collection.posts.indexOf(postId), 1);
        await collection.save();
    });
    
    await Post.deleteOne(post);
    console.log('게시물 삭제 완료');
    res.json({message: "게시물 삭제가 완료되었습니다."});
})); 

module.exports = router;