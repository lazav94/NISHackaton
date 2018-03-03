const {
    userInfo,
    sendTextMessage,
    sendQuickReplies,
    sendGenericTemplate,
    sendLocationButton,
    sendOffer,
    sendOffers,
    sendOffersList
} = require('./messenger');


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

                console.log('Sender', sender);
                const offers = [{
                        name: 'Ponuda1',
                        shortDescription: "Opis",
                        image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                    },
                    {
                        name: 'Ponuda2',
                        shortDescription: "Opis",
                        image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                    },
                    {
                        name: 'Ponuda3',
                        shortDescription: "Opis",
                        image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                    }
                ];

                // await sendOffer(sender, {
                //     name: 'Ponuda',
                //     shortDescription: "Opis",
                //     image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                // });


                // await sendOffers(
                //     sender,
                //     offers,
                //     // ['1', '2']
                // );


                await sendOffersList(
                    sender,
                    offers, ['1', '2']
                );


                // Logic
            } else if (event.postback && event.postback.payload) {
                console.log('Postback or payload');
                const {
                    postback
                } = event;
                const {
                    payload
                } = postback;
                console.log(postback, payload);

                console.log(await userInfo(sender));
            }
        }
    } else {
        console.log('Not type message');
    }
}