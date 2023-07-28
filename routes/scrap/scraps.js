const { Router } = require('express');
const router = Router();
const passport = require('passport');

const User = require('../../models/User');
const Collection = require('../../models/Collection');

const asyncHandler = require('../../utils/async-handler');
const statusCode = require('../../utils/status-code');

/* 스크랩하기 */
router.post('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {

    const { collectionId } = req.body;
    const { postId } = req.params;
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

    const collection = await Collection.findById(collectionId);
    // 컬렉션 작성자와 로그인 유저 일치하는지
    if (!collection.user.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "해당 컬렉션에 접근할 수 없음"});
    }

    // 이미 스크랩되어있는지 -> DELETE 요청 필요
    if (collection.posts.includes(postId)) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "이미 스크랩되어 있습니다."});
    }

    // posts 배열에 추가
    collection.posts.push(postId);
    await collection.save();

    console.log("스크랩 생성 완료");
    res.json({ message: "해당 게시물을 스크랩하였습니다."});

}));

/* 스크랩 컬렉션 변경하기 */
router.put('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {

    const { collectionId } = req.body;
    const { postId } = req.params;
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

    // 기존 Collection의 posts에서 제거
    const preCollection = await Collection.findOne({ 
        user: user._id,
        posts: postId
     });
    // 컬렉션 찾기 실패
    if (!preCollection) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 컬렉션 없음"});
    }
    preCollection.posts.splice(preCollection.posts.indexOf(postId), 1);
    await preCollection.save();

    // 입력 받은 Collection의 posts에 추가
    const updatedCollection = await Collection.findById(collectionId);
    // 컬렉션 작성자와 로그인 유저 일치하는지
    if (!updatedCollection.user.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "해당 컬렉션에 접근할 수 없음"});
    }
    updatedCollection.posts.push(postId);
    await updatedCollection.save();

    console.log("스크랩 컬렉션 변경 완료");
    res.json({ message: "스크랩 컬렉션을 변경하였습니다."});
}));

/* 스크랩 해제하기 */
router.delete('/:postId', passport.authenticate('jwt', {session: false}), asyncHandler(async (req, res) => {

    const { collectionId } = req.body;
    const { postId } = req.params;
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

    const collection = await Collection.findById(collectionId);
    // 컬렉션 작성자와 로그인 유저 일치하는지
    if (!collection.user.equals(user._id)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "해당 컬렉션에 접근할 수 없음"});
    }

    // 스크랩 없는 경우
    if (!collection.posts.includes(postId)) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "스크랩이 존재하지 않습니다."});
    }

    // 기존 Collection의 posts에서 제거
    collection.posts.splice(collection.posts.indexOf(postId), 1);
    await collection.save();

    console.log("스크랩 해제 완료");
    res.json({ message: "스크랩을 해제하였습니다."});

}));

module.exports = router;