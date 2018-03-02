const FBMessenger = require('fb-messenger');
const token = process.env.ACCESS_TOKEN;
var messenger = new FBMessenger(token);


module.exports = async (id, data, type) => {


    if (type === 'message') {
        // console.log('📦  TYPE: message');
        // console.log('📦', data);
        for (let i = 0; i < data.length; i += 1) {
            const event = data[i];
            const sender = event.sender.id;

            const ref = event.referral && event.referral.ref ? event.referral.ref : '';
            if (positionNames.indexOf(ref) !== -1) {
                console.log('REF Position');
                // await sendApplyButtons(sender, ref, token, bot);

                return;
            }

            if (id !== sender) {
                // const user = await getInfo(sender, token);

                
            }
        }
    } else {
        console.log('JDFKJDKLSFJKLDJFKSL');
    }

}