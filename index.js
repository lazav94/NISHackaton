require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');



app.set('port', (process.env.PORT || 5000));

app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'));

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));


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

require('./routes')(app /*, db*/ );


app.listen(app.get('port'), () => {
    // console.log('⭐  status', utils.mainCron.running);
    console.log('Running on port:', app.get('port'));
});