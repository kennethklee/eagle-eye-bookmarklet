var app = module.exports = require('./app');

if (require.main === module) {
    var port = process.env.PORT || 3000;

    app.listen(port, function() {
        console.log('Application listening on port %d in %s mode.', port, app.settings.env);
    });
}