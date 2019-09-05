import {GithubPoller } from './poller'

const poller = new GithubPoller (5000)
poller.start()