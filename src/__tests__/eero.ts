import { Client, NetworkClient } from './../client'
import { Eero, idFromUrl } from './../eero'

describe('eero helpers', () => {
  test('idFromUrl: network url', () => {
    const parsedId = idFromUrl('/2.2/networks/64254')
    expect(parsedId).toBe('64254')
  })

  test('idFromUrl: eeros url', () => {
    const parsedId = idFromUrl('/2.2/eeros/3536439')
    expect(parsedId).toBe('3536439')
  })

  test('idFromUrl: devices url', () => {
    const parsedId = idFromUrl('/2.2/devices/4842')
    expect(parsedId).toBe('4842')
  })

  test('idFromUrl: id', () => {
    const parsedId = idFromUrl('2342')
    expect(parsedId).toBe('2342')
  })

  test('idFromUrl: garbage', () => {
    const parsedGarbage = idFromUrl('2.8/something/1337')
    expect(parsedGarbage).toBeNull()
  })
})

describe('needsLogin', () => {
  test('needsLogin: true', () => {
    const eero = Eero(() => {}, Client({} as any), null)
    expect(eero.needsLogin()).toBeTruthy()
  })

  test('needsLogin: false', () => {
    const eero = Eero(() => {}, Client({} as any), 'xxxx')
    expect(eero.needsLogin()).toBeFalsy()
  })
})

type MockClientRequest = (
  action: string,
  {
    json,
    sessionCookie,
  }: {
    json?: any
    sessionCookie?: string
  },
) => any

const runMocked = async (
  clientCommand: (client: NetworkClient) => Promise<void>,
  requests: MockClientRequest[],
) => {
  const client: NetworkClient = {
    get: (action, options): Promise<never> => {
      fail('get is not implemented')
    },

    post: async (action, { json, sessionCookie }) => {
      const request = requests.shift()

      if (request === undefined) {
        fail(
          `unexpected request ${JSON.stringify({
            action,
            json,
            sessionCookie,
          })}`,
        )
      }

      return request(action, { json, sessionCookie })
    },
  }
  await clientCommand(client)
  expect(requests.length).toBe(0)
}

describe('refreshing', () => {
  test('no refresh needed', async () => {
    await runMocked(
      async (client) => {
        const eero = Eero(() => {}, client, '1234')
        await eero.rebootEero('123')
      },
      [
        (action) => {
          expect(action).toBe('eeros/123/reboot')
          return { done: true }
        },
      ],
    )
  })

  test('refresh succeeds', async () => {
    await runMocked(
      async (client) => {
        const eero = Eero(() => {}, client, '1234')
        await eero.rebootEero('123')
      },
      [
        (action) => {
          expect(action).toBe('eeros/123/reboot')
          throw new Error('error.session.refresh')
        },
        (action, { sessionCookie }) => {
          expect(action).toBe('login/refresh')
          expect(sessionCookie).toBe('1234')
          return { user_token: '5678' }
        },
        (action, { sessionCookie }) => {
          expect(action).toBe('eeros/123/reboot')
          expect(sessionCookie).toBe('5678')
          return { done: true }
        },
      ],
    )
  })
})
