const { Router } = require('express');
const router = Router();

const tourInfo = require('../utils/tour-info');
const asyncHandler = require('../utils/async-handler');
const statusCode = require("../utils/status-code");


router.get('/', asyncHandler(async (req, res) => {
    const {region} = req.query;

    if (!region) {
        return res.status(statusCode.BAD_REQUEST).json({error: "지역을 선택하세요."});
    }

    // 지역에 맞는 관광지 필터링
    const filteredTours = tourInfo.filter((tour) => {
        const location = JSON.stringify(tour.location).split(' ')[0];
        return location.includes(region);
    });

    res.json(filteredTours);
}));



module.exports = router;