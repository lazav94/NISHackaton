const sendTextMessage = require('./messenger').sendTextMessage;
const sendQuickReplies = require('./messenger').sendQuickReplies;
const sendGenericTemplate = require('./messenger').sendGenericTemplate;
const sendLocationButton = require('./messenger').sendLocationButton;
const sendOffer = require('./messenger').sendOffer;
const sendOffers = require('./messenger').sendOffers;

module.exports = async (id, data, type) => {
    console.log('Conversation');

    if (type === 'message') {
        console.log('📦  TYPE: message');
        // console.log('📦', data);
        for (let i = 0; i < data.length; i += 1) {
            const event = data[i];
            const sender = event.sender.id;
            if (event.message && event.message.text) {
                let text = event.message.text
                console.log('Text: ', text);
                await sendTextMessage(sender, [`HACKATON1: ${text}`]);
                // await sendQuickReplies(sender, 'Opa', ['1','1']);
                // await sendGenericTemplate(sender,  'text', 'http://www.romania-insider.com/wp-content/uploads/2012/07/NIS-gazprom1.jpg', 'title', 'subtitle')
                // await sendLocationButton(sender);
                await sendOffer(sender, {name : 'Ponuda', shortDescription : "Opis", image_url : "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"});

                const offer = [
                    {name : 'Ponuda', shortDescription : "Opis", image_url : "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"},
                    {name : 'Ponuda', shortDescription : "Opis", image_url : "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"},
                    {name : 'Ponuda', shortDescription : "Opis", image_url : "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"}
                ]
                await sendOffers(
                    sender,
                    offer,
                    ['1','2']
                );

            }
        }
    } else {
        console.log('Not type message');
    }
}