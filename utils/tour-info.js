const request = require('request');
const convert = require('xml-js');

// 공공 API에서 관광지 정보 받아오기
const url = 'http://api.data.go.kr/openapi/tn_pubr_public_trrsrt_api';
const serviceKey = 'lzQ%2BGyumiJBpbEBhDNX6WO9WoTJ7leGpYVrHXLhNQiYI1eoBlgLWcuIp%2FMp02Vdnv4PIIKHgsksULew1PYczyg%3D%3D';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000');

var tourData = [];

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    if(error) {
        console.log(error)
    }
    // xml파일 Json 형태 변환 후 파싱
    var xmlToJson = convert.xml2json(body, {compact: true, spaces: 4});
    var parsedJson = JSON.parse(xmlToJson);

    // 관광지명, 위치, 소개 정보
    for(i in parsedJson['response']['body']['items']['item']) {
        tourData.push({
            name : parsedJson['response']['body']['items']['item'][i]['trrsrtNm']['_text'],
            location : parsedJson['response']['body']['items']['item'][i]['rdnmadr']['_text'],
            introduction : parsedJson['response']['body']['items']['item'][i]['trrsrtIntrcn']['_text']
        })
    }
});

module.exports = tourData;