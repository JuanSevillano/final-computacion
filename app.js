var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var Twit = require('twit');
// Iniciando la lectura de Twitter con el Auth de @juandsevillano
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


//var santaMarta = [ '11.2407900', '-74.1990400' ];

var stream = T.stream('statuses/filter', { track: '' });
stream.on('tweet', function (tweet) {
    var ubicacion = tweet.user.location;
    if(ubicacion != null){
    var str = ubicacion.split(",");
    var stri = ubicacion.split(" ");
    console.log(str[0] + ' ' + stri[0]);
    }

    fs.writeFile("tweet.json",JSON.stringify(tweet,null,2));
});

// Obteniendo el stream de User
//var stream = T.stream('user');
// Siguiendo tweets con streaming
//stream.on('tweet', visualizacion);
// Callback del streaming tweets
function visualizacion(eventMsg) {
    var x = Math.floor(Math.random()*2);
    // Nombre de quien nos menciona
    var replyto = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var from = eventMsg.user.screen_name;
    var ubicacion = eventMsg.user.geo_enabled;
    var hash = eventMsg.entities.hashtags.text;

    if(hash === 'uribe' && ubicacion === true){
        console.log(ubicacion);
        console.log(hash);
        console.log('twit' + ' ' + text);
        var newTweet = '@' + from + ' '+ 'enviando un tweet back a alguien que me etiqueto' + x;
        //tweetSome(newTweet);
    }
    ///fs.writeFile("tweet.json",JSON.stringify(event,null,2));
}

// Cada vez que alguien me sigue
stream.on('follow', followed);
// funcion callback cuando te siguen
function followed(e) {
    // Obteniendo el nombre del usuario
    var nombre = e.source.name;
    // @usuario
    var screenName = e.source.screen_name;
    tweetSome('@' + screenName + ' ' + ' Gracias por seguir nuestro proyecto #Lighty #DelPapelALaComputacion #Sevi #Cuadros #Velasco');
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

function tweetImage() {
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

//------ express config ----------- //

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



