var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var Twit = require('twit');
// Iniciando la lectura de Twitter con el Auth de @JuanSevillano
// Config es el require de config.js
var config = require('./config');
var T = new Twit(config);
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// setting routers 
app.use('/', index);
app.use('/users', users);


/*
 //var ran = Math.floor(Math.random() * 100);
 //tweetSome("nee advance on sketch #processing #creativeCode");
 //tweetSome("No me odien, no me bloqueen, new advance on server #NodeJs #TwitterApi #TuMeEstasHablandoEsDeAdrenalina" + ' ' + ran);
 // Conversión en tiempo para hacer un intervalo
 // 1000 = 1s * 60 = 1m * 60 = 1h * 24 = 1d
 //setInterval(tweetSome, 1000 * 20); // Cada 20 segundos va a pubicar con estos hashtags
 */

// Getting the accces to executable cmd
tweetIt();
setInterval(tweetIt, 1000 * 20);

function tweetIt() {
    // Runing from console
    var cmd = 'processing-java --sketch=..\lineaCurva --run';
    var cmd2 = 'processing-java --sketch=C:\Users\jimmy\Desktop\Terreno --run';
    exec(cmd, processing);
    var x = 1;

    function processing() {
        // Finding result and readind it in Base64
        var filename = '../untitled1/lineaCurva/output.png';
        var filename2 = '../../Desktop/Terreno/output.png';
        var params = {
            encoding: 'base64'
        }
        var b64 = fs.readFileSync(filename, params);
        // Posting image
        T.post('media/upload', {media_data: b64}, uploaded);

        function uploaded(err, data, response) {
            // Creating the tweet afeter create the Meadia Id on Tw
            var id = data.media_id_string;
            x = x * Math.random(4);
            var tweet = {
                status: '@juansevillano  tweeting different images on server #creativeCode #NodeJs #TwitterApi ' + ' ' + x,
                media_ids: [id]
            }
            T.post('statuses/update', tweet, tweeted);

        }

        function tweeted(err, data, response) {
            if (err) {
                console.log("Something went wrong!");
                console.log(err +' ' +JSON.stringify(err))
            } else {
                console.log("It worked!");
            }
        }
    }
}


function tweetSome(txt) {
    var tweet = {
        status: txt
    }
    T.post('statuses/update', tweet, tweeted);
    // Que hacer cuando ya he tuiteado!
    function tweeted(err, data, response) {
        if (err) {
            console.log('Hay un problemitap!');
            console.log(JSON.stringify(err));
        } else {
            console.log('Funciona');
        }
    }
}

function findTweet() {
    var params = {
        q: '#siendo',
        count: 30
    };
    T.get('search/tweets', params,
        function (err, data, response) {
            // Callback con los datos
            var tweets = data.statuses;
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
            }

        }
    );
}

// Obteniendo el stream de User
var stream = T.stream('user');
// CAda vez que alguien me sigue
stream.on('follow', followed);
function followed(e) {
    // Obteniendo el nombre del usuario
    var nombre = e.source.name;
    // @usuario
    var screenName = e.source.screen_name;
    tweetSome('@' + screenName + ' ' + ' Thank you for follow!! i\'m uploading #CreativeCoding #DesignProjects');
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var hostname = 'localhost';
var port = 3000;
// inicianso server
app.listen(port, hostname, function () {
    console.log("Servidor http:// " + hostname + " port: " + port);
});



