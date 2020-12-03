import {
  Client,
  FetchFunction,
  FetchResponse,
  Eero,
  StoreCookieFn,
} from './src/'
import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
import yargs from 'yargs'
import { createInterface } from 'readline'

const cookieStoreFile = 'session.cookie'

const storeCookie: StoreCookieFn = async (cookie: string) => {
  await writeFile(cookieStoreFile, cookie)
}

const loadCookie: () => Promise<string | null> = async () => {
  try {
    return await readFile(cookieStoreFile, { encoding: 'utf-8' })
  } catch {
    return null
  }
}

const logJson = (object: any) => {
  console.log(JSON.stringify(object, undefined, '  '))
}

const testTs = (
  object: any,
  name: string,
  importType: string,
  declarationType?: string,
) => {
  const json = JSON.stringify(object, undefined, '  ')
  return `import {${importType}} from './src/types'
  
const ${name}: ${declarationType ?? importType} = ${json}
  `
}

const main = async () => {
  const debugFetch: FetchFunction = async (
    url,
    options,
  ): Promise<FetchResponse> => {
    // logJson({ request: { url, options } })
    const json = await (await fetch(url, options)).json()
    // logJson({ response: json })
    return { json: () => json }
  }

  const eero = Eero(storeCookie, Client(debugFetch), await loadCookie())

  yargs(process.argv.slice(2))
    .command<{ email: string }>(
      'login <email|phone>',
      'start login process',
      () => {},
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
        const response = await eero.loginVerify(sessionToken, authToken)

        logJson({ response })

        rl.close()
      },
    )
    .command('account', 'show account info', async () => {
      const account = await eero.account()
      console.log(testTs(account, 'account', 'Account'))
    })
    .command('network', 'show details for all networks', async () => {
      const account = await eero.account()
      const networks = await Promise.all(
        account.networks.data.map(async ({ url }) => await eero.network(url)),
      )
      console.log(testTs(networks, 'networks', 'Network', 'Network[]'))
    })
    .command('eeros', 'show all eeros on all networks', async () => {
      const account = await eero.account()
      const eeros = await Promise.all(
        account.networks.data.map(async ({ url }) => await eero.eeros(url)),
      )
      console.log(testTs(eeros, 'eeros', 'EeroHotspot', 'EeroHotspot[][]'))
    })
    .command('devices', 'show all devices on all networks', async () => {
      const account = await eero.account()
      const devices = await Promise.all(
        account.networks.data.map(async ({ url }) => await eero.devices(url)),
      )
      console.log(testTs(devices, 'devices', 'Device', 'Device[][]'))
    })
    .command<{ eeroId: string }>(
      'rebootEero <eeroId>',
      'reboot an eero',
      () => {},
      (argv) => {
        const rebootResponse = eero.rebootEero(argv.eeroId)
        logJson(rebootResponse)
      },
    )
    .command('refreshCookie', 'refresh the session cookie', async () => {
      const response = await eero.refreshSessionCookie()
      logJson(response)
    })
    .demandCommand(1)
    .help().argv
}

main()
