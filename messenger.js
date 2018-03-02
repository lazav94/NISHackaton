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
    messageData.quick_replies.push({ content_type: 'text', title: quickReplies[i], payload: 'DEVELOPER_DEFINED_PAYLOAD' });
  }
  sendRequest(messageData, sender);
}



// buttons 


function sendGenericTemplate(sender, text, image_url, title, subtitle ) {
  console.log('generic template');


  const messageTemplateData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title,
            subtitle,
            image_url,
            buttons:  [
              {
                title: 'Apply Now!',
                type: 'postback',
                payload: 'apply',
              },
              {
                title: 'Show Open Positions',
                type: 'postback',
                payload: 'positions',
              },
              {
                title: `About`,
                type: 'postback',
                payload: 'about_company',
              },
            ],
          },
        ],
      },
    },
  };
  return new Promise((resolve, reject) => {
    sendRequest(messageTemplateData, sender).then(() => {
      resolve();
    });
  });
}


async function sendLocationButton(sender){
  
  const messageTemplateData = {
    "message":{
      "text": "Here is a quick reply!",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Search",
          "payload":"<POSTBACK_PAYLOAD>",
          "image_url":"http://example.com/img/red.png"
        },
        {
          "content_type":"location"
        }
      ]
  };

  return new Promise((resolve, reject) => {
    sendRequest(messageTemplateData, sender).then(() => {
      resolve();
    });
  });

}

async function sendPositionTemplate(elements, messageData) {
  console.log('Get position template');
  const sender = messageData.sender;
  const bot = messageData.bot;
  const token = messageData.token;


  // Get position image
  const messageTemplateData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: `${position.name}`,
            subtitle: `${position.shortDescription}`,
            image_url: ((position && position.positionImg && position.positionImg !== '') ? position.positionImg : 'https://s2.postimg.org/3y41etr6h/Artboard_2_copy.png'),
            buttons: [
              {
                title: 'Apply Now!',
                type: 'postback',
                payload: `${position.name}_apply`,
              },
              {
                title: 'Other Positions',
                type: 'postback',
                payload: 'positions',
              },
            ],
          },
        ],
      },
    },
  };
  return new Promise((resolve, reject) => {
    sendRequest(messageTemplateData, sender).then(() => {
      resolve();
    });
  });
}





module.exports = {
  userInfo,
  sendTextMessage,
  sendQuickReplies,
  sendGenericTemplate,
  sendLocationButton
};
