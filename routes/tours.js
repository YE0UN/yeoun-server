const { Router } = require('express');
const router = Router();

const tourInfo = require('../utils/tour-info');
const asyncHandler = require('../utils/async-handler');


router.get('/', asyncHandler(async (req, res) => {
    const {region} = req.query;

    // 조건을 만족하는 관광지만 필터링
    const filteredTours = region
        ? tourInfo.filter((tour) => {
            const location = JSON.stringify(tour.location).split(' ')[0];
            return location.includes(region);
        })
        : null;

    res.json(filteredTours || tourInfo);
  }));


module.exports = router;