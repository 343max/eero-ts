import { Client, FetchFunction } from './client'
import { Account, Device, Network } from './types'
export type SessionStore = {
  setCookie: (value: string) => Promise<void>
  getCookie: () => Promise<string | null>
}

export const idFromUrl = (idOrUrl: string): string | null => {
  const m = idOrUrl.match(/^\/[0-9.]+\/(eeros|networks|devices)\/([0-9]+)$/)
  if (m !== null) {
    return m[2]
  } else if (idOrUrl.match(/^[0-9]+$/)) {
    return idOrUrl
  } else {
    return null
  }
}

export const Eero = (
  session: SessionStore,
  fetchFunc: FetchFunction,
  sessionCookie: string | null,
) => {
  const API_ENDPOINT = 'https://api-user.e2ro.com/2.2/'
  const client = Client(API_ENDPOINT, fetchFunc)

  const cookie = { sessionCookie: sessionCookie ?? undefined }

  return {
    needsLogin: async (): Promise<boolean> => {
      return (await session.getCookie()) !== null
    },

    login: async (userIdentifier: string): Promise<string> => {
      const json = await client.post('login', {
        json: { login: userIdentifier },
      })
      console.log({ json })
      return json.user_token as string
    },

    loginVerify: async (
      sessionCookie: string,
      authToken: string,
    ): Promise<any> => {
      const json = await client.post('login/verify', {
        json: { code: authToken },
        sessionCookie,
      })
      cookie.sessionCookie = sessionCookie
      session.setCookie(sessionCookie)
      return json
    },

    account: async (): Promise<Account> =>
      client.get('account', { sessionCookie: cookie.sessionCookie }),

    network: async (networkId: string): Promise<Network> =>
      client.get('networks/' + idFromUrl(networkId), {
        sessionCookie: cookie.sessionCookie,
      }),

    eeros: async (networkId: string) =>
      client.get(`networks/${idFromUrl(networkId)}/eeros`, {
        sessionCookie: cookie.sessionCookie,
      }),

    devices: async (networkId: string): Promise<Device[]> =>
      client.get(`networks/${idFromUrl(networkId)}/devices`, {
        sessionCookie: cookie.sessionCookie,
      }),
  }
}
