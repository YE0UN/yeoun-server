const { Router } = require('express');
const router = Router();

const tourInfo = require('../utils/tour-info');
const asyncHandler = require('../utils/async-handler');
const statusCode = require("../utils/status-code");
const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주' ];
const regionMapping = {
    '충북': '충청북도',
    '충남': '충청남도',
    '전북': '전라북도',
    '전남': '전라남도',
    '경북': '경상북도',
    '경남': '경상남도'
};

router.get('/', asyncHandler(async (req, res) => {
    const {region} = req.query;

    // 지역 미선택 시 에러
    if (!region) {
        return res.status(statusCode.BAD_REQUEST).json({error: "지역이 선택되지 않음"});
    }

    // regions 리스트에 없는 지역 요청 시 에러
    if (!regions.includes(region)) {
        return res.status(statusCode.BAD_REQUEST).json({error: "올바르지 않은 지역 요청"});
    }

    // 지역명 매핑
    const mappedRegion = regionMapping[region];

    // 지역에 맞는 관광지 필터링
    const filteredTours = tourInfo.filter((tour) => {
        const location = JSON.stringify(tour.location).split(' ')[0];
        return location.includes(region) || location.includes(mappedRegion);
    });

    res.json(filteredTours);
}));

module.exports = router;