import { sendSlackMessage } from './slack'
import { getPrReviewRequests} from './github'

export class GithubPoller {
  errorCount = 0
  pollTimeout: number
  constructor(pollTimeout: number) {
    this.pollTimeout = pollTimeout
  }
  async start() {
    console.log('starting GithubPoller')
    while(this.errorCount < 5) {
      try {
        console.log('polling...')
        await this.pollAndSend()
      } catch (e) {
        console.log(e)
        this.errorCount ++ 
      }
      await this.timeoutP(this.pollTimeout) 
    }
    process.exit()
 }
  async pollAndSend() {
    const revReqs =  await getPrReviewRequests()
    if (!revReqs) {
      return 
    }
    for (let req of revReqs) {
      const message = `your review was requested for PR: <${req.subject.url}>`
      sendSlackMessage(message)
    }
  
  }
  async timeoutP(timeout: number) {
   return new Promise((resolve, reject) => {
     setTimeout(resolve, timeout)
   }) 
  }
}