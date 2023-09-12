const request = require('request');

// 공공 API에서 관광지 정보 받아오기
const url = 'https://apis.data.go.kr/B551011/PhotoGalleryService1/galleryList1';
const serviceKey = process.env.SERVICE_KEY;
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10000');
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest');
queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('A');
queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');

var tourData = [];

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    if(error) {
        console.log(error)
    }

    var parsedJson = JSON.parse(response.body);

    for(i in parsedJson['response']['body']['items']['item']) {
                tourData.push({
                    name : parsedJson['response']['body']['items']['item'][i]['galTitle'],
                    location : parsedJson['response']['body']['items']['item'][i]['galPhotographyLocation'],
                    img : parsedJson['response']['body']['items']['item'][i]['galWebImageUrl']
                })
            }

});

module.exports = tourData;