import axios, { AxiosRequestConfig} from 'axios'
import { replace } from 'lodash'
interface GithubNotification {
  id: number,
  unread: boolean,
  reason: GithubNotificationReason,
  subject: GithubNotificationSubject
}

enum GithubNotificationReason {
  reviewRequest = "review_requested"
}

interface GithubNotificationSubject {
  title: string,
  url: string
}
export const getPrReviewRequests = async () => {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_OAUTH_TOKEN
  if (!username || !token) {
    throw new Error('github username or token not present')
  }
  const url = 'https://api.github.com/notifications?all=true'
  const config : AxiosRequestConfig = {
    auth: {
      username,
      password: token
    }
  } 
  return axios.get(url, config)
  .then((res) => {
    const notifications : GithubNotification[] = res.data.map((d) => { return coerceGithubNotification(d) })
    const revReqs = notifications.filter( (notification) => {
      return notification.reason == GithubNotificationReason.reviewRequest 
    })
    if (revReqs == []) {
      return null
    }
    console.log(revReqs)
    return revReqs
  })
  .catch((err) => {
    console.log(err)
    throw err
  })
}

const coerceGithubNotification = (data: any) : GithubNotification | null  => {
  if (!data) {
    return null
  } 
  return {
    id: parseInt(data.id),
    unread: Boolean(data.unread),
    reason: data.reason,
    subject: {
      title: data.subject.title,
      url: coerceGithubUrl(data.subject.url)
    }
  }  
} 

function coerceGithubUrl(url: string | null) : string {
  if(!url) {
    throw new Error('No PR URL')
  }
  const url2 = replace(url, 'api.', '')
  const url3 = replace(url2, '/repos', '')
  return replace(url3, 'pulls', 'pull')
}


