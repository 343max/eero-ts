import { NetworkClient } from './../client'
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

const MockClient: (
  requests: MockClientRequest[],
) => NetworkClient & { remainingRequests: () => number } = (requests) => {
  return {
    get: (action, options): Promise<never> => {
      fail('get is not implemented')
    },

    post: (action, { json, sessionCookie }) => {
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

      const result = request(action, { json, sessionCookie })
      return new Promise((resolve) => resolve(result))
    },

    remainingRequests: () => requests.length,
  }
}

describe('refreshing', () => {
  test('no refresh needed', () => {
    const client = MockClient([
      (action) => {
        expect(action).toBe('reboot/1234')
        return { done: true }
      },
    ])
    const eero = Eero(() => {}, client, '1234')

    eero.rebootEero('123')

    expect(client.remainingRequests()).toBe(0)
  })
})
