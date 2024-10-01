import config from '@/config'
import { GatewayApiClient, RadixNetwork } from '@radixdlt/babylon-gateway-api-sdk'
import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
import React, { type ReactNode, useEffect, useState } from 'react'

const applicationName = 'PAWNFT'
const applicationDappDefinitionAddress = config.dappDefinitionAddress
const applicationVersion = '1.0.0'
const networkId = RadixNetwork.Stokenet

export const RadixContext = React.createContext<{
  loading: boolean
  api?: GatewayApiClient
  rdt?: RadixDappToolkit
}>({ loading: true })

export default function RadixProvider({ children }: { children: ReactNode }) {
  const [rdt, setRdt] = useState<RadixDappToolkit>()
  const [api, setApi] = useState<GatewayApiClient>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const radixDappToolkit = RadixDappToolkit({
      applicationDappDefinitionAddress,
      applicationName,
      applicationVersion,
      networkId,
    })

    const gatewayApiClient = GatewayApiClient.initialize({
      applicationDappDefinitionAddress,
      applicationName,
      applicationVersion,
      networkId,
    })

    setRdt(radixDappToolkit)
    setApi(gatewayApiClient)
    setLoading(false)
  }, [])

  return <RadixContext.Provider value={{ loading, api, rdt }}>{children}</RadixContext.Provider>
}
