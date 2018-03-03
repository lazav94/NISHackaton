require('dotenv').config();
const conversation = require('./conversation');
const request = require('request');
const uuidv4 = require('uuid/v4');



const pythonURL = '';
const javaURL = '';

module.exports = (app, db) => {

    // 1) When someone is near android send me ID and station id
    app.post('/near', async (res, req) => {
        try {

            console.log(req.body);
            const {
                id,
                stationId
            } = req.body;

            console.log(`ID: ${id}`);
            console.log(`Station id: ${stationId}`);

            const json = {
                id,
                stationId
            }

            // 2) Redirect this informations to python
            httpRequest.post(pythonURL, {
                json
            }, (err, httpResponse, body) => {
                console.log(httpResponse.statusCode);
                if (err) {
                    console.log(err);
                } else {
                    console.log('Request successfully send');
                }
            });

            res.sendStatus(200);

        } catch (error) {
            console.log('Near error:', error);
        }
    });

    // 3) Endpoint where I get offer and all data from DB
    app.post('/offer', async (req, res) => {
        const {
            data
        } = req.body;

        const token = uuidv4(); // ⇨ '416ac246-e7ac-49ff-93b4-f7e94d997e6b'
        console.log('Genereted UUID: ', token);
        
        const json = {
            data,
            token,
            date: Date.now()
        };

        // 4) Send to java this data
        httpRequest.post(javaURL, {
            json
        }, (err, httpResponse, body) => {
            console.log(httpResponse.statusCode);
            if (err) {
                console.log(err);
            } else {
                console.log('Request successfully send');
            }
        });

    });







    //////////////// SEKTA
    app.get('/', (req, res) => {
        console.log('AJDE PRORADI')
        res.send('Jenna is here!');
    });

    app.get('/webhook', (req, res) => {
        if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
            res.send(req.query['hub.challenge']);
        }
        res.send('Error, wrong token');
    });


    app.post('/webhook', (req, res) => {
        console.log("Webhook");
        const {
            id
        } = req.body.entry[0];
        res.redirect(307, `/webhook/${id}`);
    });

    // communication between candidate and chat botP
    app.post('/webhook/:id', async (req, res) => {

        let standby,
            messaging;
        const {
            id
        } = req.params;
        console.log(`Webhook: ${id}`);

        let type = '';
        let data;
        if (req.body.entry) {
            const entry = req.body.entry[0];
            if (entry.standby) {
                data = entry.standby[0];
                type = 'standby';
            } else if (entry.messaging) {
                data = entry.messaging;
                type = 'message';
            }

            await conversation(id, data, type);


            res.status(200).end();
        } else {
            console.log('WHY?');
            res.status(500).send('Internal server error');
        }
    });
};