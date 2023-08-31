const MD5 = require('crypto-js/md5');
require('dotenv').config();

function getParams (searchBy = "") {
    searchBy.trim();
    const key = MD5(1 + "0ebb0d046933d4b6934248b1cd1adb8b48892107" + "045f3b6f0feb72129d011e0c8c2da774").toString();
    let params = `limit=100&ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=${key}`;
    console.log(params);
}

getParams();