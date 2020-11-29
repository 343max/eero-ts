import { Client, FetchFunction } from './../client'

describe('client tests', () => {
  test('GET', async () => {
    const endpoint = 'https://example.com/v42/'
    const fetch: FetchFunction = (url, options) => {
      expect(url).toBe(`${endpoint}get`)
      expect(options).toStrictEqual({
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      return { json: () => ({ meta: { code: 200 }, data: 'payload' }) }
    }

    const client = Client(endpoint, fetch)
    const response = await client.get('get')
    expect(response).toStrictEqual('payload')
  })

  test('GET with cookie', async () => {
    const endpoint = 'https://example.com/v42/'
    const fetch: FetchFunction = (url, options) => {
      expect(url).toBe(`${endpoint}get`)
      expect(options).toStrictEqual({
        method: 'GET',
        headers: { Accept: 'application/json', Cookie: 's=someCookie' },
      })
      return { json: () => ({ meta: { code: 200 }, data: 'payload' }) }
    }

    const client = Client(endpoint, fetch)
    const response = await client.get('get', { sessionCookie: 'someCookie' })
    expect(response).toStrictEqual('payload')
  })

  test('POST', async () => {
    const endpoint = 'https://example.com/v42/'
    const fetch: FetchFunction = (url, options) => {
      expect(url).toBe(`${endpoint}post`)
      expect(options).toStrictEqual({
        body: '{"b":23}',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      return { json: () => ({ meta: { code: 200 }, data: 'payload' }) }
    }

    const client = Client(endpoint, fetch)
    const response = await client.post('post', { json: { b: 23 } })
    expect(response).toStrictEqual('payload')
  })

  test('POST with cookies', async () => {
    const endpoint = 'https://example.com/v42/'
    const fetch: FetchFunction = (url, options) => {
      expect(url).toBe(`${endpoint}post`)
      expect(options).toStrictEqual({
        body: '{"b":23}',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: 's=someCookie',
        },
      })
      return { json: () => ({ meta: { code: 200 }, data: 'payload' }) }
    }

    const client = Client(endpoint, fetch)
    const response = await client.post('post', {
      json: { b: 23 },
      sessionCookie: 'someCookie',
    })
    expect(response).toStrictEqual('payload')
  })

  test('POST without body', async () => {
    const endpoint = 'https://example.com/v42/'
    const fetch: FetchFunction = (url, options) => {
      expect(url).toBe(`${endpoint}post`)
      expect(options).toStrictEqual({
        method: 'POST',
        body: undefined,
        headers: {
          Accept: 'application/json',
        },
      })
      return { json: () => ({ meta: { code: 200 } }) }
    }

    const client = Client(endpoint, fetch)
    const response = await client.post('post', {})
  })
})
