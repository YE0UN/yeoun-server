const request = require('request');
const convert = require('xml-js');

var url = 'http://api.data.go.kr/openapi/tn_pubr_public_trrsrt_api';
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
    var xmlToJson = convert.xml2json(body, {compact: true, spaces: 4});
    var parsedJson = JSON.parse(xmlToJson);
    for(i in parsedJson['response']['body']['items']['item']) {
        tourData.push({
            name : parsedJson['response']['body']['items']['item'][i]['trrsrtNm']['_text'],
            location : parsedJson['response']['body']['items']['item'][i]['rdnmadr']['_text'],
            introduction : parsedJson['response']['body']['items']['item'][i]['trrsrtIntrcn']['_text']
        })
    }
    console.log(tourData);
});

module.exports = tourData;