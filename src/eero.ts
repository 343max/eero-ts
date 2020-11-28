import { Client, FetchFunction } from './client'
export type SessionStore = {
  setCookie: (value: string) => Promise<void>
  getCookie: () => Promise<string | null>
}

type AccountResponse = {
  // I mapped everything that was `null` for me to `any`
  name: string
  phone: {
    value: string
    country_code: string
    national_number: string
    verified: boolean
  }
  email: {
    value: string
    verified: boolean
  }
  log_id: string
  organization_id: any
  image_assets: any
  networks: {
    count: 1
    data: [
      {
        url: string
        name: string
        created: string
        access_expires_on: any
        amazon_directed_id: string
      },
    ]
  }
  auth: {
    type: string
    provider_id: any
    service_id: any
  }
  role: string
  can_transfer: boolean
  is_premium_capable: boolean
  payment_failed: boolean
  premium_status: string
  premium_details: {
    trial_ends: any
    has_payment_info: boolean
    tier: string
  }
  push_settings: {
    networkOffline: boolean
    nodeOffline: boolean
  }
  trust_certificates_etag: string
  consents: {
    marketing_emails: {
      consented: boolean
    }
  }
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

  const cookie = { sessionCookie }

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

    account: async (): Promise<AccountResponse> =>
      client.get('account', { sessionCookie: sessionCookie ?? undefined }),

    network: async (networkId: string) =>
      client.get('networks/' + idFromUrl(networkId), {
        sessionCookie: sessionCookie ?? undefined,
      }),
  }
}
