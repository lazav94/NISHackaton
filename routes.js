require('dotenv').config();
const conversation = require('./conversation');
const httpRequest = require('request');
const uuidv4 = require('uuid/v4');





const pythonURL = '';
const javaURL = '';

module.exports = (app, db) => {

    // 1) When someone is near from mobile [Android] receive ID and ID of nearest station 
    app.post('/near', async (req, res) => {
        try {
            console.log('Near endpoint');

            console.log(req.body);
            const {
                id,
                stationId
            } = req.body;

            console.log(`ID: ${id}`);
            console.log(`Station id: ${stationId}`);

            // const json = {
            //     id,
            //     stationId
            // }

            // // 2) Redirect this informations to python
            // httpRequest.post('/requestoffer', {
            //     json
            // }, (err, httpResponse, body) => {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log(httpRequest);
            //         console.log('Request successfully send');
            //     }
            // });

            const token = uuidv4(); // ⇨ '416ac246-e7ac-49ff-93b4-f7e94d997e6b'
            console.log('Genereted UUID: ', token);
            json = [{
                    id,
                    stationId,
                    name: 'Ime ponude',
                    description: 'Opis ponude',
                    prize: 200,
                    discount: '24%',
                    date: Date.now(),
                    qr: 'https://www.qrstuff.com/images/sample.png',
                    token

                },
                {
                    id: "1231",
                    stationId: '321`',
                    name: 'Ime ponud1e',
                    description: 'Opis 1ponude',
                    prize: 2001,
                    discount: '20%',
                    date: Date.now(),
                    qr: 'https://www.qrstuff.com/images/sample.png',
                    token
                }
            ]
            res.json(json);


            // res.sendStatus(200);

        } catch (error) {
            console.log('Near error:', error);
        }
    });


    app.post('/order', async (req, res) => {
        console.log(req.body);
        try {

            let sum = 0;
            await Promise.all(req.body.orders.map(order => {
                sum += (order.prize - order.prize * order.discount);
            }));
            console.log(`💳 The cost of all orders ${sum}`);
            // RES.STATUS send status to loyalty card api!
            res.json({ response : "💳"});
        } catch (error) {
            console.log(error);
        }
    });


    // 3) Endpoint where I get offer and all data from DB
    app.post('/offer', async (req, res) => {
        const {
            offer
        } = req.body;

        // id
        // stationId
        // offer.name;
        // offer.description; 
        // offer.image_url;  
        // offer.prize;    
        // offer.discount  


        // 4) Send to java this data
        // httpRequest.post(javaURL, {
        //     json
        // }, (err, httpResponse, body) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('Request successfully send');
        //     }
        // });

    });

    app.get('/offer', async (req, res) => {
        console.log('DFKLSJKLF')
        res.sendStatus(200)
    });




    //////////////// SEKTA
    app.get('/', async (req, res) => {
        console.log('/');
        res.render('index.ejs', {});
        // res.send('Nis is here!');
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