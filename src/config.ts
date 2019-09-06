import * as fs from 'fs'
import * as toml from 'toml'
import * as path from 'path'
import { isBoolean, isPlainObject, isFinite, isString, overEvery, negate, isSafeInteger } from 'lodash'
import * as objectPath from 'object-path'

let configPath = process.env.CONFIG_PATH || path.join(__dirname, '../config.toml')

// If --config= is passed in, override config path accordingly
for (const arg of process.argv) {
  if (arg.startsWith('--config=')) {
    const [_, configPathValue] = arg.split('=')
    configPath = configPathValue
  }
}

console.log('Using config file:', configPath)

function configValidate(obj: object, typeName: string, space: string, varNames: string[], fn: Function): void {
  for (const v of varNames) {
    if (!fn(objectPath.get(obj, `${space}.${v}`))) {
      throw new Error(`Expected ${space}.${v} to be ${typeName}`)
    }
  }
}

const isSafePositiveInteger = overEvery([isFinite, negate(isNaN), isSafeInteger, (v: number) => (v > 0)])

const tc = toml.parse(fs.readFileSync(configPath, 'utf8'))

// --- config variables ----------------------

export interface ConfigVars {
  slackUserId: string 
  slackToken: string 
  githubUserName: string
  githubToken: string 
}

if (!isPlainObject(tc.github)) {
  throw new Error('Missing github stanza in config')
}
if (!isPlainObject(tc.slack)) {
  throw new Error('Missing slack stanza in config')
}
configValidate(tc, 'is string', 'slack', ['user_id','token'], isString)

configValidate(tc, 'is string', 'github', ['user_name','token'], isString)

export const configs: ConfigVars = {
  githubUserName: tc.github.user_name,
  githubToken: tc.github.token,
  slackUserId: tc.slack.user_id,
  slackToken: tc.slack.token
}