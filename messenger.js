const request = require('request');
const path = require('path');
const fs = require('fs');
const FBMessenger = require('fb-messenger');
const async = require('async');
// const Bot = require('../models/bot.model');
// const User = require('../models/user.model');
require('dotenv').config();

const FB = require('facebook-node');
function getToken(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      logger.info(`Url: ${url}`);
      if (!err && res.statusCode === 200) {
        const response = JSON.parse(body);
        console.log('🔑  ', response);
        resolve(response.access_token);
      } else {
        logger.error('=== ERROR ===');
        logger.error(res.statusCode);
        logger.error(res.statusMessage);
        logger.error(res);
        logger.error(err);
        reject(err);
      }
    });
  });
}


// async function create(req, res) {
//   FB.setAccessToken(token);
//   FB.api('me/accounts', {
//     fields: ['id', 'name', 'access_token']
//   }, async (response) => {
//     const { data } = response;
//     console.log('📦  ', data);
//     const pages = data.filter(page => page.id == id);
//     console.log('📃  ', pages);
//     const page = pages[0];
//     console.log('🖇️  ', page);

//     // let url = `https://graph.facebook.com/oauth/access_token?client_id=${process.env.APP_ID}&client_secret=
//     // ${process.env.APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${page.access_token}`;
//     const url = `https://graph.facebook.com/oauth/access_token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${page.access_token}`;

//     const codeUrl = `https://graph.facebook.com/oauth/client_code?access_token=${req.user.facebook.token}&client_secret=${process.env.APP_SECRET}&redirect_uri=http://localhost:8081/setup&client_id=${process.env.APP_ID}`;

//     // await getToken(codeUrl);






const token = "EAACcvCFTOBsBAABkYLVmfAJxQpU8eaOJL4ZAfmL5Q9hwTwL9XvVz518tTz7VBMak9jp2E9F439UNdNwN8Ms8YNmNUyGHfG1XhyLLF0aR6rkvfmDdUgq50WlKIjy7bYHFUvsftTUIao9lOb70s2Go6GMPhksUPal6mtiaRfgZDZD"
const url = 'https://graph.facebook.com/v2.11/me/messages';

function userInfo(id) {
  const url = `https://graph.facebook.com/${id}?fields=first_name,last_name,age_range,gender,profile_pic&token=${token}`;
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {

      const user = JSON.parse(body);
      if (!err && res.statusCode === 200) {
        const user = JSON.parse(body);
        // console.log(user.age_range);
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

function sendPositions(sender, positions, quickReplies, bot, action) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        top_element_style: 'compact',
        elements: [],
      },
    },
    // ,
    // quick_replies: []
  };

  console.log('Action: ', action);
  if (action === 'positions') {
    console.log('posistions');
    messageData.quick_replies = [];
    for (let i = 0; i < quickReplies.length; i++) {
      messageData.quick_replies.push({ content_type: 'text', title: quickReplies[i], payload: 'DEVELOPER_DEFINED_PAYLOAD' });
    }
  } else {
    console.log('57');
    messageData.attachment.payload.buttons = [];
    messageData.attachment.payload.buttons.push({
      title: 'About positions',
      type: 'postback',
      payload: 'positions',
    });
  }

  if (positions.length === 0) {
    console.log('67');
    messageData.attachment.payload.elements.push({
      title: 'No open positions',
      subtitle: 'Sorry, currently there are no open positions.',
      image_url: 'https://s2.postimg.org/3y41etr6h/Artboard_2_copy.png',
    }, {
      title: "Didn't find a position you like?",
      subtitle: 'Send your details and we will notify you if the right position appears',
      image_url: 'https://s2.postimg.org/3y41etr6h/Artboard_2_copy.png',
      buttons: [
        {
          title: 'Send details',
          type: 'postback',
          payload: 'details',
        },
      ],
    });
    1;
  } else {
    console.log('86');
    console.log(positions.length);
    for (let i = 0; i < positions.length; i++) {
      messageData.attachment.payload.elements.push({
        title: positions[i].name,
        subtitle: positions[i].shortDescription,
        image_url: ((positions[i].positionImg && positions[i].positionImg !== '') ? positions[i].positionImg : 'https://s2.postimg.org/3y41etr6h/Artboard_2_copy.png'),
        buttons: [
          {
            title: ((action === 'positions') ? 'More info' : 'Apply Now!'),
            type: 'postback',
            payload: positions[i].name,
          },
        ],
      });
    }
    if (positions.length === 1) {
      console.log('102');
      messageData.attachment.payload.elements.push({
        title: "Didn't find a position you like?",
        subtitle: 'Send your details and we will notify you if the right position appears',
        image_url: 'https://s2.postimg.org/3y41etr6h/Artboard_2_copy.png',
        buttons: [
          {
            title: 'Send details',
            type: 'postback',
            payload: 'details',
          },
        ],
      });
    }
  }


  return new Promise((resolve, reject) => {
    sendRequest(messageData, sender, token, bot).then(() => {
      resolve();
    });
  });
}

function sendPositions2(sender, positions, quickReplies, bot) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        // top_element_style: 'compact',
        elements: [],
      },
    },
    // ,quick_replies: []
  };
  for (let i = 0; i < positions.length; i++) {
    messageData.attachment.payload.elements.push({
      title: positions[i].name,
      subtitle: positions[i].shortDescription,
      image_url: ((positions[i].positionImg && positions[i].positionImg !== '') ? positions[i].positionImg : 'https://s2.postimg.org/3y41etr6h/Artboard_2_copy.png'),
      buttons: [
        {
          title: 'More info',
          type: 'postback',
          payload: positions[i].name,
        },
      ],
    });
  }


  // for (let i = 0; i < quickReplies.length; i++) {
  //   messageData.quick_replies.push({ content_type: 'text', title: quickReplies[i], payload: 'DEVELOPER_DEFINED_PAYLOAD' });
  // }
  return new Promise((resolve, reject) => {
    sendRequest(messageData, sender, token, bot).then(() => {
      resolve();
    });
  });
}


async function sendSubscribedTemplate(sender, bot) {
  const user = await userInfo(sender, token);

  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: `Hey ${user.first_name} would you like to get updates about new positions openings at ${bot.companyName}?`,
        buttons: [
          {
            title: 'Yes 👍',
            type: 'postback',
            payload: 'SUBSCRIBE_YES',
          },
          {
            title: 'No 👎',
            type: 'postback',
            payload: 'SUBSCRIBE_NO',
          },
        ],
      },
    },
  };

  return new Promise((resolve, reject) => {
    sendRequest(messageData, sender, token, bot).then(() => {
      resolve();
    });
  });
}


async function sendApplyButtons(sender, position, bot) {
  const user = await userInfo(sender, token);

  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: `${user.first_name}, You are about to apply for ${position} position. Answer the questions and elaborate so Jenna will rank your application correctly ⚡`,
        buttons: [
          {
            title: 'Go Back',
            type: 'postback',
            payload: 'apply',
          },
          {
            title: 'Start applying',
            type: 'postback',
            payload: `${position}_apply`,
          },
        ],
      },
    },
  };

  return new Promise((resolve, reject) => {
    sendRequest(messageData, sender, token, bot).then(() => {
      resolve();
    });
  });
}

/* function sendList(sender,positions,token){
    let messageData={
        attachment:{
            type:'template',
            payload:{
                template_type:'list',
                top_element_style:'compact',
                elements:[]
            }
        },
    };
    for(let i=0;i<positions.length;i++){
        messageData.attachment.payload.elements.push({
            title:positions[i].name,
            buttons:[{
                title:'More info',
                type:'postback',
                payload:positions[i].name
            }]
        });
    }
    if(positions.length===1){
        messageData.attachment.payload.elements.push({
            title:"Didn't find a position you like?",
            subtitle:"Send your details and we will notify you if the right position appears",
            buttons:[{
                title:'Send details',
                type:'postback',
                payload:'details'
            }]
        });
    }
    return new Promise((resolve,reject)=>{
        sendRequest(messageData,sender,token)
            .then(()=>{
                resolve();
            });
    });
} */

function sendQuickReplies(sender, text, quickReplies, bot) {
  console.log('SendQuickReplies func');
  const messageData = {
    text,
    quick_replies: [],
  };
  for (let i = 0; i < quickReplies.length; i++) {
    messageData.quick_replies.push({ content_type: 'text', title: quickReplies[i], payload: 'DEVELOPER_DEFINED_PAYLOAD' });
  }
  sendRequest(messageData, sender, token, bot);
}

function sendYesNoQuickReplies(sender, text, quickReplies, bot) {
  const messageData = {
    text,
    quick_replies: [],
  };
  for (let i = 0; i < quickReplies.length; i++) {
    messageData.quick_replies.push({
      content_type: 'text',
      title: quickReplies[i],
      payload: 'DEVELOPER_DEFINED_PAYLOAD',
      image_url: (
        quickReplies[i] === 'Yes'
          ? 'http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/thumbs-up.png'
          : 'http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/thumbs-down.png'),
    });
  }
  // http://d2trtkcohkrm90.cloudfront.net/images/emoji/apple/ios-10/256/thumbs-up.png
  //
  sendRequest(messageData, sender, token, bot);
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
        token,
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

async function handleSubscription(sender, bot, quickReplies) {
  try {
    const index = bot.subscribed.findIndex(p => p.id === sender);
    if (index > -1) {
      if (quickReplies) {
        await sendTextMessage(sender, ['You are already subscribed to updates!'], token);
        await sendQuickReplies(sender, 'If you want to apply or see the positions, choose below', quickReplies.onboarding, token);
        return;
      }
    } else {
      await bot.update({
        $addToSet: {
          subscribed: {
            id: sender,
          },
        },
      });
      if (quickReplies) {
        await sendTextMessage(sender, ['Great! thank you, I will let you know whenever additional interesting positions will be added 🙂'], token);
        await sendQuickReplies(sender, 'If you want to apply or see the positions, choose below', quickReplies.onboarding, token);
        return;
      }
    }
  } catch (e) {
    if (quickReplies) {
      await sendTextMessage(sender, ['Subscription failed!'], token);
      await sendQuickReplies(sender, 'If you want to apply or see the positions, choose below', quickReplies.onboarding, token);
    }
  }

}

function sendImage(sender, bot) {
  const messageData = {
    attachment: {
      type: 'image',
      payload: {},
    },
  };
  return new Promise((resolve, reject) => {
    sendImgRequest(messageData, sender, token).then(() => {
      saveOutMessage(bot, messageData);
      resolve();
    }).catch((e) => {
      console.log(e);
      reject('Image is not sent!');
    });
  });
}

function sendImgRequest(messageData, sender) {
  const readStream = fs.createReadStream('./assets/jenna1.JPEG');
  const formData = {
    recipient: JSON.stringify({ id: sender }),
    message: JSON.stringify({
      attachment: {
        type: 'image',
        payload: {},
      },
    }),
    filedata: readStream,
    type: 'image/jpeg',
  };
  return new Promise((resolve, reject) => {
    request({
      url,
      headers: {
        'Content-type': 'multipart/form-data',
      },
      qs: {
        token,
      },
      method: 'POST',
      formData,
    }, (error, response, body) => {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
      resolve();
    });
  });
}

async function shareBot(id, companyName, sender, bot) {
  // IMAGE
  const imageUrl = `https://s3.amazonaws.com/jenna-position-images/img${Math.floor(Math.random() * Math.floor(5)) + 1}.png`;
  console.log()
  //onst user = await User.findById(bot.user[0]);

  //const url = ((user.facebook.cover && user.facebook.cover !== '') ? user.facebook.cover : imageUrl);
 
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Spread the word 🚀',
            subtitle: 'We are always hiring',
            image_url: imageUrl /*url*/,
            buttons: [
              {
                type: 'element_share',
                share_contents: {
                  attachment: {
                    type: 'template',
                    payload: {
                      template_type: 'generic',
                      elements: [
                        {
                          title: `Join ${companyName}`,
                          subtitle: 'We are always hiring',
                          image_url: 'https://s1.postimg.org/2db9zs3bf3/jenna1.jpg',
                          default_action: {
                            type: 'web_url',
                            url: `https://m.me/${id}`,
                          },
                          buttons: [
                            {
                              type: 'web_url',
                              url: `https://m.me/${id}`,
                              title: 'Apply now',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    },
  };
  return new Promise((resolve, reject) => {
    sendRequest(messageData, sender, token).then(() => {
      resolve();
    });
  });
}


async function sendGetStartedTemplate(messageData) {
  console.log('Get started template');
  const sender = messageData.sender;
  const bot = messageData.bot;

  const imageUrl = `https://s3.amazonaws.com/jenna-position-images/img${Math.floor(Math.random() * Math.floor(5)) + 1}.png`;
  // const user = await User.findById(bot.user[0]);
  // const url = ((user.facebook.cover && user.facebook.cover !== '') ? user.facebook.cover : imageUrl);

  const messageTemplateData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: `Apply to ${bot.companyName}`,
            // subtitle: 'SUBTITLE',
            image_url : imageUrl,
            buttons: [
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
                title: `About ${bot.companyName}`,
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
    sendRequest(messageTemplateData, sender, token).then(() => {
      resolve();
    });
  });
}

async function sendPositionTemplate(position, messageData) {
  console.log('Get position template');
  const sender = messageData.sender;
  const bot = messageData.bot;


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
    sendRequest(messageTemplateData, sender, token).then(() => {
      resolve();
    });
  });
}

async function saveOutMessage(bot, text) {
  // console.log('------------------------ Save out message---------------------');
  // console.log(bot);

  if (bot) {
    const message = { message: JSON.stringify(text), created_at: Date.now() };
    // await bot.outMessages.push({ message: JSON.stringify(text), created_at: Date.now() });
    console.log('🤪 pushing out message to DB ', bot.companyName);
    await Bot.update(
      { _id: bot._id },
      { $push: { outMessages: message } }
    );
    // await bot.save();
  }
}

async function endOfConversation(messageData) {
  const sender = messageData.sender;
  const bot = messageData.bot;
  const text = messageData.text;
  

  console.log('Typing...');
  fbMessenger = new FBMessenger(token);
  fbMessenger.sendAction(sender, 'typing_on');

  console.log('5 sec');
  setTimeout(async () => {
    fbMessenger.sendAction(sender, 'typing_off');
    await sendTextMessage(sender, [`Ok, done, someone from ${bot.companyName} team will soon get back to you, if they think you are a good fit for the company.`], token, bot);
    await shareBot(sender, bot.companyName, sender, token, bot);
    await sendQuickReplies(sender, 'If you want to apply or see the positions, choose below', ['Apply Now 📥', 'Open Positions 🔔', 'About Company ❓'], token, bot);
  }, 5000);
}

module.exports = {
  userInfo,
  sendTextMessage,
  sendQuickReplies,
  sendYesNoQuickReplies,
  sendPositions,
  sendImage,
  handlePayload,
  handleSubscription,
  shareBot,
  endOfConversation,
  sendGetStartedTemplate,
  sendApplyButtons,
  sendPositionTemplate,
  sendSubscribedTemplate,
  removeSubscription
};
