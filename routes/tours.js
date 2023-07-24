const { Router } = require('express');
const router = Router();

const tourInfo = require('../utils/tour-info');
const asyncHandler = require('../utils/async-handler');


router.get('/', asyncHandler(async (req, res) => {
    const {region} = req.query;
    var result = [];

    // 전체 관광지 정보
    if(!region) {
        return res.json(tourInfo);
    }

    // 지역별 관광지 정보
    tourInfo.forEach(function(tour) {
        if(JSON.stringify(tour).includes(region)) {
            result.push(tour);
        }
    });
    
    res.json(result);
  }));

module.exports = router;