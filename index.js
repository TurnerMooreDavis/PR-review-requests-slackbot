const { WebClient } = require('@slack/web-api');

console.log('this is PR-review bot.  Beep boop!');
// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.PR_REVIEW_REQUEST_TOKEN 

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
(async () => {
  // See: https://api.slack.com/methods/chat.postMessage
//  const res = await web.chat.postMessage({ channel: conversationId, text: 'Hello there', as_user: true});
  web.im.open({user: process.env.SLACK_USER_ID})
  .then((res) => {
    console.log(res)
    return web.chat.postMessage({ channel: res.channel.id, text: 'Hello there', as_user: true});
  });
})();
