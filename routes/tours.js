const { Router } = require('express');
const router = Router();

const tourInfo = require('../utils/tour-info');
const asyncHandler = require('../utils/async-handler');


router.get('/', asyncHandler(async (req, res) => {
    const {region} = req.query;
    var result = [];
    tourInfo.forEach(function(tour, index, array) {
        result.push(tour);
    });
    res.json(result);
  }));

module.exports = router;