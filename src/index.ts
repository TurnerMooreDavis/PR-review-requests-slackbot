import { WebClient } from "@slack/web-api"

console.log('this is PR-review bot.  Beep boop!')
const token = process.env.PR_REVIEW_REQUEST_TOKEN 

if (!token) {
  throw new Error('undefined slackbot token')
}
const web = new WebClient(token)
const userId = process.env.SLACK_USER_ID
if (!userId) {
  throw new Error('undefined slack user id')
}
const sendSlackMessage = (web: WebClient, userId: string) => {
  return web.im.open({user: userId}) 
  .then((res) => {
    console.log(res)
    return web.chat.postMessage({ channel: res.channel.id, text: 'Hello there', as_user: true});
  })
  .catch((e) => {
    throw new Error(e)
  })
}
sendSlackMessage(web, userId)
