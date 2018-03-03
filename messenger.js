const request = require('request');
const path = require('path');
const fs = require('fs');
const FBMessenger = require('fb-messenger');
const async = require('async');
require('dotenv').config();


const url = 'https://graph.facebook.com/v2.11/me/messages';
const token = process.env.ACCESS_TOKEN;


function userInfo(id) {
  const url = `https://graph.facebook.com/${id}?fields=first_name,last_name,age_range,gender,profile_pic&token=${token}`;
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {

      const user = JSON.parse(body);
      if (!err && res.statusCode === 200) {
        const user = JSON.parse(body);
        resolve(user);
      }
      resolve({
        id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        gender: user.gender || '',
        profile_pic: user.profile_pic || '',

      });
    });
  });
}




function sendTextMessage(sender, text) {
  return new Promise((resolve, reject) => {
    const q = async.queue(async (task, callback) => {
      await sendRequest({
        text: task,
      }, sender, token);
      callback();
    }, 1);

    q.drain = () => {
      // console.log('all items have been processed');
      resolve();
    };

    for (let i = 0; i < text.length; i++) {
      q.push(text[i], (err) => {
        if (i !== 0) { // lazar DUMB CONDITION (DELETE IF YOU NEED THIS MESAGE)
          console.log(`finished processing item ${i}`);
        }
      });
    }
  });
}

function sendRequest(messageData, sender) {
  return new Promise((resolve, reject) => {
    request({
      url,
      qs: {
        access_token: token,
      },
      method: 'POST',
      json: {
        recipient: {
          id: sender,
        },
        message: messageData,
      }
    }, (error, response, body) => {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      } else {
        resolve();
      }
    });
  });
}

function sendQuickReplies(sender, text, quickReplies) {
  console.log('SendQuickReplies func');
  const messageData = {
    text,
    quick_replies: [],
  };
  for (let i = 0; i < quickReplies.length; i++) {
    messageData.quick_replies.push({
      content_type: 'text',
      title: quickReplies[i],
      payload: 'DEVELOPER_DEFINED_PAYLOAD'
    });
  }
  sendRequest(messageData, sender);
}



// buttons 


function sendGenericTemplate(sender, text, image_url, title, subtitle) {
  console.log('generic template');


  const messageTemplateData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title,
          subtitle,
          image_url,
          buttons: [{
              title: 'See what we have',
              type: 'postback',
              payload: 'show',
            },
            {
              title: 'Show NIS',
              type: 'postback',
              payload: 'show',
            },
            {
              title: `About NIS`,
              type: 'postback',
              payload: 'about',
            },
          ],
        }, ],
      },
    },
  };
  return new Promise((resolve, reject) => {
    sendRequest(messageTemplateData, sender).then(() => {
      resolve();
    });
  });
}


async function sendLocationButton(sender) {

  const messageTemplateData = {
    "text": "Here is a quick reply!",
    "quick_replies": [{
      "content_type": "location"
    }]
  }

  return new Promise((resolve, reject) => {
    sendRequest(messageTemplateData, sender).then(() => {
      resolve();
    });
  });

}

async function sendOffer(offer) {
  console.log('Get position template');

  // Get position image
  const messageTemplateData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: `${offer.name}`,
          subtitle: `${offer.shortDescription}`,
          image_url: offer.image_url,
          buttons: [{
              title: 'Buy!',
              type: 'postback',
              payload: `${offer.name}`,
            },
            {
              title: 'Other offers',
              type: 'postback',
              payload: 'other',
            },
          ],
        }, ],
      },
    },
  };
  return new Promise((resolve, reject) => {
    sendRequest(messageTemplateData, sender).then(() => {
      resolve();
    });
  });
}


function sendOffers(sender, offer, quickReplies, access_token, bot, action) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        top_element_style: 'compact',
        elements: [],
      },
    },
    quick_replies:
  };

  for (let i = 0; i < offer.length; i++) {
    messageData.attachment.payload.elements.push({
      title: offer[i].name,
      subtitle: offer[i].shortDescription,
      image_url: offer[i].image_url,
      buttons: [{
        title: 'Buy',
        type: 'postback',
        payload: offer[i].name,
      }],
    });
  }


  return new Promise((resolve, reject) => {
    sendRequest(messageData, sender).then(() => {
      resolve();
    });
  });
}



module.exports = {
  userInfo,
  sendTextMessage,
  sendQuickReplies,
  sendGenericTemplate,
  sendLocationButton,
  sendOffers,
  sendOffer
};