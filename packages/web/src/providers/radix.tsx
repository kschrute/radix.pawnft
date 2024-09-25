'use client'

import { GatewayApiClient, RadixNetwork } from '@radixdlt/babylon-gateway-api-sdk'
import { DataRequestBuilder, RadixDappToolkit, type WalletDataStateAccount } from '@radixdlt/radix-dapp-toolkit'
import React, { useEffect, useState } from 'react'

const applicationDappDefinitionAddress = 'account_tdx_2_129s6vwhnh6948kf6wfruevqjrd00dwh2yhrgvx937zf6tmjuqzgjl4'

export const radixDappToolkit = RadixDappToolkit({
  applicationDappDefinitionAddress,
  networkId: RadixNetwork.Stokenet,
  applicationName: 'Radix Web3 dApp',
  applicationVersion: '1.0.0',
})

export const gatewayApiClient = GatewayApiClient.initialize({
  networkId: RadixNetwork.Stokenet,
  applicationName: 'Radix Web3 dApp',
  applicationVersion: '1.0.0',
  applicationDappDefinitionAddress,
  // applicationDappDefinitionAddress: 'account_rdx12y4l35lh2543nfa9pyyzvsh64ssu0dv6fq20gg8suslwmjvkylejgj',
})

export const RdtContext = React.createContext(radixDappToolkit)
export const GatewayContext = React.createContext(gatewayApiClient)

export function useRadix() {
  const [account, setAccount] = useState<WalletDataStateAccount>()

  const rdt = React.useContext(RdtContext)
  const api = React.useContext(GatewayContext)

  useEffect(() => {
    // ************ Connect to wallet and display details ************
    rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1))
    // Subscribe to updates to the user's shared wallet data, then display the account name and address.
    rdt.walletApi.walletData$.subscribe((walletData) => {
      console.log('connected wallet data: ', walletData)
      // Set the account variable to the first and only connected account from the wallet
      const account = walletData.accounts[0]
      console.log('account', account)
      setAccount(account)
      // Display the account name and address on the page
      // document.getElementById("accountName").innerText =
      // account?.label ?? "None connected";
      // document.getElementById("accountAddress").innerText =
      // account?.address ?? "None connected";
    })
  }, [rdt])

  return { rdt, api, account }
}
