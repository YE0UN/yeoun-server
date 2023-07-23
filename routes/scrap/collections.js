const { Router } = require('express');
const router = Router();

const User = require('../../models/User');
const Collection = require('../../models/Collection');

const asyncHandler = require('../../utils/async-handler');
const statusCode = require('../../utils/status-code');

/* 컬렉션 보기 */
router.get('/', asyncHandler(async (req, res) => {
    
    const { userId } = req.body;
    
    const result = await Collection.find({ user: userId });
    res.json(result);
}));

/* 컬렉션 생성하기 */
router.post('/', asyncHandler(async (req, res) => {

    const { name, userId } = req.body;
    
    // 로그인 여부 확인
    if (!userId) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다."});
    }

    // 회원 존재 확인
    if (!await User.exists({ _id: userId })) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "존재하지 않는 회원입니다."});
    }

    // 필수 작성 validation + 공백 막기
    if (!name.trim()) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "이름을 입력하세요."});
    }

    const collection = await Collection.create({
        name,
        user: userId,
    });

    console.log('컬렉션 생성 완료');
    res.json(collection);
}));

/* 컬렉션 수정하기 */
router.put('/:collectionId', asyncHandler(async (req, res) => {
    
    const collection = await Collection.findById(req.params.collectionId);
    // 컬렉션 찾기 실패
    if (!collection) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 컬렉션 없음"});
    }

    const { name, userId } = req.body;
    
    // 로그인 여부 확인
    if (!userId) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다."});
    }

    // 회원 존재 확인
    if (!await User.exists({ _id: userId })) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "존재하지 않는 회원입니다."});
    }

    // 컬렉션 작성자와 로그인 유저 일치하는지
    if (!collection.user.equals(userId)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "수정할 권한이 없습니다."});
    }

    // 필수 작성 validation + 공백 막기
    if (!name.trim()) {
        res.status(statusCode.BAD_REQUEST);
        return res.json({error: "이름을 입력하세요."});
    }

    collection.name = name;
    await collection.save();

    console.log('컬렉션 수정 완료');
    res.json(collection);
}));

/* 컬렉션 삭제하기 */
router.delete('/:collectionId', asyncHandler(async (req, res) => {
    const collection = await Collection.findById(req.params.collectionId);
    // 컬렉션 찾기 실패
    if (!collection) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "해당 컬렉션 없음"});
    }

    const { userId } = req.body;
    
    // 로그인 여부 확인
    if (!userId) {
        res.status(statusCode.UNAUTHORIZED);
        return res.json({error: "로그인이 필요합니다."});
    }

    // 회원 존재 확인
    if (!await User.exists({ _id: userId })) {
        res.status(statusCode.NOT_FOUND);
        return res.json({error: "존재하지 않는 회원입니다."});
    }

    // 컬렉션 작성자와 로그인 유저 일치하는지
    if (!collection.user.equals(userId)) {
        res.status(statusCode.FORBIDDEN);
        return res.json({error: "수정할 권한이 없습니다."});
    }
   
    await Collection.deleteOne(collection);
    
    console.log('컬렉션 삭제 완료');
    res.json({message: "컬렉션 삭제가 완료되었습니다."});
}));

module.exports = router;