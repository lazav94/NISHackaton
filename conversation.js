const FBMessenger = require('fb-messenger');
const token = process.env.ACCESS_TOKEN;
var messenger = new FBMessenger(token);


module.exports = async (id, data, type) => {
    console.log('Conversation');

    if (type === 'message') {
        console.log('📦  TYPE: message');
        // console.log('📦', data);

        for (let i = 0; i < data.length; i += 1) {
            const event = data[i];
            const sender = event.sender.id;
            console.log('IDEMOO')
            messenger.sendTextMessage(sender, 'HACKATON');
                
        }
    } else {
        console.log('JDFKJDKLSFJKLDJFKSL');
    }

}