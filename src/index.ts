import { WebClient} from "@slack/web-api"

console.log('this is PR-review bot.  Beep boop!')
const token = process.env.PR_REVIEW_REQUEST_TOKEN 
interface WebClientChannel {
  id: string
}

if (!token) {
  throw new Error('undefined slackbot token')
}
const web = new WebClient(token)
const userId = process.env.SLACK_USER_ID
if (!userId) {
  throw new Error('undefined slack user id')
}
const sendSlackMessage = async (web: WebClient, userId: string) => {
  const res = await web.im.open({user: userId}) 
  const channel = coerceChannel(res.channel) 
  if (typeof channel == "object") {
    if (channel != null) {
      return web.chat.postMessage({ channel: channel.id, text: 'Hello there', as_user: true});
    }
  }
}
const coerceChannel = (channel: any) : WebClientChannel => {
  return {
    id: channel.id
  }
}
sendSlackMessage(web, userId)
