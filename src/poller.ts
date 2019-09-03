import { sendSlackMessage } from './slack'
import { getPrReviewRequests} from './github'


export const pollAndSend = async () => {
  const revReqs =  await getPrReviewRequests()
  if (!revReqs) {
    return 
  }
  for (let req of revReqs) {
    const message = `your review was requested for PR: <${req.subject.url}>`
    sendSlackMessage(message)
  }

}