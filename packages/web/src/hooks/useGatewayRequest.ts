import { useCallback } from 'react'

const API_URL = 'https://stokenet.radixdlt.com'

export default function useGatewayRequest() {
  return useCallback(async (uri: string, data: Object, params?: RequestInit) => {
    try {
      const response = await fetch(`${API_URL}${uri}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        ...params,
      })

      const isResponseJson = response.headers.get('content-type')?.includes('application/json')

      const responseData = isResponseJson ? await response.json() : ((await response.text()) ?? response.statusText)

      if (!response.ok) {
        throw Error(responseData)
      }

      return responseData
    } catch (e) {
      console.error(e)
      throw e
    }
  }, [])
}
