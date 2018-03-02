const sendTextMessage = require('./messenger').sendTextMessage;

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
            }
        }
    } else {
        console.log('Not type message');
    }

}