const express = require('express');
const app = express();
const credentials = require('./credentials');
const pg = require('pg');
//var bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
var multer = require('multer');


var diskStorage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, req.session.user.userID + '_' + Date.now() + file.originalname);
    }
});

var uploader = multer({

    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});



app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/uploads'));
app.use(require('body-parser').urlencoded({
    extended: false
}));

createNewPsqlClient = function (pgUser, pgPassword) {
    var client = new pg.Client('postgres://' + credentials.pgUser + ':' + credentials.pgPassword + '@localhost:5432/users');
    client.connect(function(err) {
        if (err) {
            console.log(err);
        }
    });
    return client;
}

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');
});

app.post('/registration', function(req, res) {

    //cache.del('users');
    if (!req.body.name.length || !req.body.email.length || !req.body.password.length) {
        //res.redirect('/name/index.html');
        return;
    } else {
        var client = createNewPsqlClient(credentials.pgUser, credentials.pgPassword);

        var query = 'INSERT INTO messageBoardUsers(name, email, password) VALUES($1, $2, $3) RETURNING id';
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;

            client.query(query, [name, email, password], function(err, results) {
                if (err) {
                    console.log(err);

                    var duplicateEmailError = ['Email exists in a database'];

                } else {

                    client.end();

                    req.session.user = {
                        userID: results.rows[0].id,
                        name: results.rows[0].name
                    }

                    res.sendStatus(200);
                }
            });
        //});
    }
});

app.post('/login', function (req, res) {

    if (!req.body.email.length || !req.body.password.length) {
        //res.redirect('/name/index.html');
        return;
    } else {
        var client = createNewPsqlClient(credentials.pgUser, credentials.pgPassword);

        var query = 'SELECT * FROM messageBoardUsers WHERE messageBoardUsers.email = $1 AND messageBoardUsers.password = $2';
        var email = req.body.email;
        var password = req.body.password;

        client.query(query, [email, password], function(err, results) {
            if (err) {
                console.log(err);

                var duplicateEmailError = ['Email exists in a database'];

            } else {

                if (!results.rows.length){
                    console.log('password does not match');

                    res.sendStatus(403);
                    return;
                }
                if (results.rows[0].email == email) {

                    req.session.user = {
                        userID: results.rows[0].id,
                        name: results.rows[0].name
                    }

                    client.end();

                    res.sendStatus(200);
                }
            }
        });
    }
});
app.get('/logout', function (req, res) {

    req.session = null;
    res.redirect('/');

})

app.get('/messages', function (req, res) {

    if (!req.session.user) {
        res.sendStatus(403);
        return;
    }

    var client = createNewPsqlClient(credentials.pgUser, credentials.pgPassword);
    var query = 'SELECT * FROM messages;';
    client.query(query, function(err, results) {
        if (err) {
            console.log(err);
        } else {

            res.json({
                messages: results.rows
            });
            console.log(req.session);
        }
    });
})

app.post('/messages', function (req, res) {
    console.log(req.session);
    var client = createNewPsqlClient(credentials.pgUser, credentials.pgPassword);
    var query = 'INSERT INTO messages(name, message, userid) VALUES($1, $2, $3) RETURNING id;';
    var name = req.session.user.name;
    var message = req.body.message;
    var userID = req.session.user.userID;

    client.query(query, [name, message, userID], function (err, results) {

        if (err) {
            console.log(err);
        } else {

            console.log('it works');
            res.json(
                {
                    success: true
                }
            );
        }
    });
});

app.post('/upload', uploader.single('file'), function(req, res) {

    if (req.file) {
        res.json({
            success: true,
            file: '/uploads/' + req.file.filename
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080);
