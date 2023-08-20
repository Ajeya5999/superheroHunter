const MD5 = require('crypto-js/md5');
require('dotenv').config();

module.exports.params = function() {
    const timeStamp = Date.now();
    const key = MD5(timeStamp + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).toString();
    return `ts=${timeStamp}&apikey=${process.env.PUBLIC_KEY}&hash=${key}`
}