export type FetchGetOptions = {
  method: 'GET'
  headers: { [key: string]: string }
}

export type FetchPostOptions = {
  method: 'POST'
  headers: { [key: string]: string }
  body: string
}

export type FetchResponse = {
  json: () => Promise<any> | any
}

export type FetchFunction = (
  url: string,
  options: FetchGetOptions | FetchPostOptions,
) => Promise<FetchResponse> | FetchResponse

type EeroResponse = {
  meta: { code: number; error: string | undefined; server_time: string }
  data: any
}

export const Client = (endpoint: string, fetch: FetchFunction) => {
  const fetchAndProcess = async (
    url: string,
    sessionCookie: string | undefined,
    options: FetchGetOptions | FetchPostOptions,
  ) => {
    const headers = {
      ...options.headers,
      ...(sessionCookie ? { Cookie: `s=${sessionCookie}` } : {}),
    }
    const response = (await (
      await fetch(url, { ...options, headers })
    ).json()) as EeroResponse

    if (response.meta.code !== 200 && response.meta.code !== 201) {
      throw new Error(response.meta.error)
    }

    return response.data
  }

  return {
    get: async (action: string, options?: { sessionCookie?: string }) => {
      const { sessionCookie } = options ?? {}
      return fetchAndProcess(endpoint + action, sessionCookie, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
    },

    post: async (
      action: string,
      {
        json,
        sessionCookie,
      }: {
        json: any
        sessionCookie?: string
      },
    ) => {
      return fetchAndProcess(endpoint + action, sessionCookie, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    },
  }
}
