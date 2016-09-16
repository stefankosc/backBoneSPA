const express = require('express');
const app = express();
const credentials = require('./credentials');
const pg = require('pg');


app.use(express.static(__dirname + '/static'));
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

                    /*req.session.user = {
                        data: req.body.firstname + ' ' + req.body.lastname,
                        userID: results.rows[0].id,
                        email: email
                    }*/

                    res.end();
                }
            });
        //});
    }
});

app.post('/login', function (req, res) {

});


app.listen(8080);
