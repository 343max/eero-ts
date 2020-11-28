import { FetchFunction, FetchResponse } from './src/client'
import { Eero, SessionStore } from './src/eero'
import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
import yargs from 'yargs'
import { createInterface } from 'readline'

const cookieStoreFile = 'session.cookie'
const store: SessionStore = {
  setCookie: async (cookie: string) => {
    await writeFile(cookieStoreFile, cookie)
  },
  getCookie: async (): Promise<string | null> => {
    const cookie = await readFile(cookieStoreFile, { encoding: 'utf-8' })
    return cookie
  },
}

const main = async () => {
  const debugFetch: FetchFunction = async (
    url,
    options,
  ): Promise<FetchResponse> => {
    console.log({ request: { url, options } })
    const json = await (await fetch(url, options)).json()
    console.log({ response: json })
    return { json: () => json }
  }

  const eero = Eero(store, debugFetch)

  yargs(process.argv.slice(2))
    .command<{ email: string }>(
      'login <email|phone>',
      'start login process',
      (y) => {},
      async (argv) => {
        console.log('requesting auth token')

        const sessionToken = await eero.login(argv.email)

        const rl = createInterface({
          input: process.stdin,
          output: process.stdout,
        })

        const question = async (question: string): Promise<string> => {
          return new Promise((resolve, reject) => {
            rl.question(question, (input) => resolve(input))
          })
        }

        const authToken = await question('Authentication Token: ')
        const response = eero.loginVerify(sessionToken, authToken)

        console.log({ response })
      },
    )
    .demandCommand(1)
    .help().argv
}

main()
