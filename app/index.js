var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    app = module.exports = express(),
    uglify = require('uglify-js');

app.configure(['development', 'staging', 'production'], function() {
    app.use(express.logger());
});

app.configure(function() {

    app.enable('trust proxy');
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.bodyParser());
    app.use(app.router);

});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showMessage: true, showStack: true }));
});

app.configure(['staging', 'production'], function() {
    app.use(express.errorHandler({ dumpExceptions: true }));
});


// Routes
app.get('/', function(req, res, next) {
    fs.readFile(path.join(__dirname, 'bookmarklet.js'), {encoding: 'UTF-8'}, function(err, code) {
        if (err) {
            return next();
        }

        var minifiedCode = uglify.minify(code, {fromString: true});
        res.render('index', minifiedCode);
    });
});