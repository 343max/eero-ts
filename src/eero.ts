import { Client, FetchFunction, NetworkClient } from './client'
import { Account, Device, Network } from './types'

export type StoreCookieFn = (value: string) => void

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
  storeCookie: StoreCookieFn,
  client: NetworkClient,
  sessionCookie: string | null,
) => {
  const cookie = { sessionCookie: sessionCookie ?? undefined }

  const refreshSessionCookie = async () => {
    const response = await client.post<{ user_token: string }>(
      'login/refresh',
      {
        sessionCookie: cookie.sessionCookie,
      },
    )
    const newCookie = response.user_token
    cookie.sessionCookie = newCookie
    storeCookie(newCookie)
    return newCookie
  }

  const refreshed = async <T>(call: () => Promise<T>): Promise<T> => {
    try {
      return await call()
    } catch (error) {
      if (error.message === 'error.session.refresh') {
        await refreshSessionCookie()
        return await call()
      } else {
        throw error
      }
    }
  }

  return {
    needsLogin: (): boolean => {
      return cookie.sessionCookie !== undefined
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
      storeCookie(sessionCookie)
      return json
    },

    refreshSessionCookie,

    account: async (): Promise<Account> =>
      refreshed(() =>
        client.get('account', { sessionCookie: cookie.sessionCookie }),
      ),

    network: async (networkId: string): Promise<Network> =>
      refreshed(() =>
        client.get('networks/' + idFromUrl(networkId), {
          sessionCookie: cookie.sessionCookie,
        }),
      ),

    eeros: async (networkId: string) =>
      refreshed(() =>
        client.get(`networks/${idFromUrl(networkId)}/eeros`, {
          sessionCookie: cookie.sessionCookie,
        }),
      ),

    devices: async (networkId: string): Promise<Device[]> =>
      refreshed(() =>
        client.get(`networks/${idFromUrl(networkId)}/devices`, {
          sessionCookie: cookie.sessionCookie,
        }),
      ),

    rebootEero: async (eeroId: string): Promise<Device[]> =>
      refreshed(() =>
        client.post(`eeros/${idFromUrl(eeroId)}/reboot`, {
          sessionCookie: cookie.sessionCookie,
        }),
      ),
  }
}
