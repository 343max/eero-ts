import { Client, FetchFunction } from './client'
export type SessionStore = {
  setCookie: (value: string) => Promise<void>
  getCookie: () => Promise<string | null>
}

export const Eero = (session: SessionStore, fetchFunc: FetchFunction) => {
  const API_ENDPOINT = 'https://api-user.e2ro.com/2.2/'
  const client = Client(API_ENDPOINT, fetchFunc)

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
      sessionToken: string,
      authToken: string,
    ): Promise<any> => {
      const json = await client.post('login/verify', {
        json: { code: authToken },
        cookies: { s: sessionToken },
      })
      session.setCookie(sessionToken)
      return json
    },
  }
}
