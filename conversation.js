const sendTextMessage = require('./messenger').sendTextMessage;

module.exports = async (id, data, type) => {
    console.log('Conversation');

    if (type === 'message') {
        console.log('📦  TYPE: message');
        // console.log('📦', data);
        console.log('data', data.length)
        for (let i = 0; i < data.length; i += 1) {


            const event = data[i];
            let text = event.message.text
            const sender = event.sender.id;
            if (event.message && event.message.text) {
                console.log('Text: ', text);
                await sendTextMessage(sender, ['HACKATON1: text']);


            }
        }
    } else {
        console.log('JDFKJDKLSFJKLDJFKSL');
    }

}
// function sendTextMessage(sender, text) {
//     let messageData = { text:text }
//     request({
// 	    url: 'https://graph.facebook.com/v2.6/me/messages',
// 	    qs: {access_token:process.env.ACCESS_TOKEN},
// 	    method: 'POST',
// 		json: {
// 		    recipient: {id:sender},
// 			message: messageData,
// 		}
// 	}, function(error, response, body) {
// 		if (error) {
// 		    console.log('Error sending messages: ', error)
// 		} else if (response.body.error) {
// 		    console.log('Error: ', response.body.error)
// 	    }
//     })
// }