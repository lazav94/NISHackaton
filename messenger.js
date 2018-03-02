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

async function handlePayload(sender, bot, payload, replies, quickReplies, positions) {
  console.log('handle payload');
  if (payload === 'Subscribe') {
    console.log('SUBSCRIBE ACTION');
    handleSubscription(sender, token, bot, quickReplies);
  }
  const tempArray = replies[payload].slice();
  const textForQuickReply = replies[payload][replies[payload].length - 1];
  tempArray.splice(-1, 1);

  if (payload === 'positions') {
    await sendTextMessage(sender, tempArray, token);
    await sendPositions(sender, positions, quickReplies[payload], token);
  } else if (payload === 'about_company') {
    sendQuickReplies(sender, textForQuickReply, quickReplies[payload], token);
  }
}

async function removeSubscription(sender, bot, quickReplies) {
  try {
    const index = bot.subscribed.findIndex(p => p.id === sender);
    if (index > -1) {
      await bot.update({
        $pull: {
          subscribed: {
            id: sender
          }
        }
      });
      await sendTextMessage(sender, ['You are now unsubscribed!'], token);
      await sendQuickReplies(sender, 'If you want to apply or see the positions, choose below', quickReplies.onboarding, token);
    } else {
      await sendTextMessage(sender, ['OK, no problem 👌 You can always change your mind and activate the open positions notifications from the menu at the bottom.'], token);
      await sendQuickReplies(sender, 'If you want to apply or see the positions, choose below', quickReplies.onboarding, token);
      return; 
    } 
  } catch (e) {
    console.log(e);
  }
}


module.exports = {
  userInfo,
  sendTextMessage,
};
