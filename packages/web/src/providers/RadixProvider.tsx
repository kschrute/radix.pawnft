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

  // useEffect(() => {
  //   if (rdt) {
  //     console.log('Updating...')
  //   }
  //   // rdt?.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1))
  //   // rdt?.walletApi.setRequestData(
  //   //     DataRequestBuilder.persona().withProof(),
  //   //     DataRequestBuilder.accounts().exactly(2),
  //   //     DataRequestBuilder.personaData().fullName().emailAddresses(),
  //   // )
  //   rdt?.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1))
  //   // Subscribe to updates to the user's shared wallet data, then display the account name and address.
  //   rdt?.walletApi.walletData$.subscribe((walletData) => {
  //     console.log('connected wallet data: ', walletData)
  //     // Set the account variable to the first and only connected account from the wallet
  //     const account = walletData.accounts[0]
  //     console.log('account', account)
  //     setAccount(account)
  //   })
  // }, [rdt])

  return <RadixContext.Provider value={{ loading, api, rdt }}>{children}</RadixContext.Provider>
}
