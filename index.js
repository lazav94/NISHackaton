const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');


process.on('unhandledRejection', (reason, p) => {
    console.log('🚧 UnhandledPromiseRejectionWarning: Unhandled promise rejection', p, ' reason: ', reason);
});


app.set('port', (process.env.PORT || 8081));


app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));



// mongoose.Promise = global.Promise;
// mongoose.connect(DBurl, {
//     useMongoClient: true
// }, (err, db) => {
//     if (!err) {
//         require('./routes')(app, db);
//         console.log('Connection to database established!');
//     }
// });