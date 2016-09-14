const express = require('express');

const app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {

    console.log('YO');
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080);
