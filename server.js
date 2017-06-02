/**
 * Created by berlin on 2017/6/2.
 * 伺服静态文件服务
 */
var express = require('express');
var app = express();

app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
