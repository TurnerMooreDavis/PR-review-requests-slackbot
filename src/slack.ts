import { WebClient} from "@slack/web-api"
interface WebClientChannel {
  id: string
}

export const sendSlackMessage = async (message: string) => {
  const token = process.env.PR_REVIEW_REQUEST_TOKEN 
  if (!token) {
    throw new Error('undefined slackbot token')
  }
  const web = new WebClient(token)
  const userId = process.env.SLACK_USER_ID
  if (!userId) {
    throw new Error('undefined slack user id')
  }
  const res = await web.im.open({user: userId}) 
  const channel = coerceChannel(res.channel) 
  if (typeof channel == "object") {
    if (channel != null) {
      return web.chat.postMessage({ channel: channel.id, text: message, as_user: true});
    }
  }
}
const coerceChannel = (channel: any) : WebClientChannel => {
  return {
    id: channel.id
  }
}
