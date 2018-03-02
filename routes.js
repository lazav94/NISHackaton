require('dotenv').config();
const conversation = require('./conversation');


module.exports = (app, db) => {

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
        const { id } = req.body.entry[0];
        res.redirect(307, `/webhook/${id}`);
    });

    // communication between candidate and chat bot
    app.post('/webhook/:id', async (req, res) => {
        
        let standby,
            messaging;
        const { id }  = req.params;
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
            try {
                // const bot = await Bot.findOne({ id })
                //   .populate('positions')
                //   .exec();
                await conversation(id, data, type);
                res.status(200).end();
            } catch (e) {
                res.status(404).send('Bot not found!');
            }
        } else {
            res.status(500).send('Internal server error');
        }
    });
};