// 'use client'
//
// // import { CoreApiClient } from '@radixdlt/babylon-core-api-sdk'
// import { GatewayApiClient, RadixNetwork } from '@radixdlt/babylon-gateway-api-sdk'
// import { DataRequestBuilder, RadixDappToolkit, type WalletDataStateAccount } from '@radixdlt/radix-dapp-toolkit'
// import React, { useEffect, useState } from 'react'
//
// const applicationName = 'Radix Web3 dApp'
// const applicationDappDefinitionAddress = 'account_tdx_2_129s6vwhnh6948kf6wfruevqjrd00dwh2yhrgvx937zf6tmjuqzgjl4'
// const applicationVersion = '1.0.0'
// const networkId = RadixNetwork.Stokenet
// const logicalNetworkName = 'stokenet'
//
// export const radixDappToolkit = RadixDappToolkit({
//   applicationDappDefinitionAddress,
//   applicationName,
//   applicationVersion,
//   networkId,
// })
//
// // export const coreApiClient = await CoreApiClient.initialize({
// //   basePath: 'http://127.0.0.1:3333/core',
// //   logicalNetworkName,
// // })
//
// export const gatewayApiClient =
//   window !== undefined &&
//   GatewayApiClient.initialize({
//     applicationDappDefinitionAddress,
//     applicationName,
//     applicationVersion,
//     networkId,
//   })
//
// export const RdtContext = React.createContext(radixDappToolkit)
// // export const CoreContext = React.createContext(coreApiClient)
// export const GatewayContext = React.createContext(gatewayApiClient)
//
// export function useRadix() {
//   const [account, setAccount] = useState<WalletDataStateAccount>()
//
//   const rdt = React.useContext(RdtContext)
//   const api = React.useContext(GatewayContext)
//   // const core = React.useContext(CoreContext)
//
//   useEffect(() => {
//     rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1))
//     // Subscribe to updates to the user's shared wallet data, then display the account name and address.
//     rdt.walletApi.walletData$.subscribe((walletData) => {
//       console.log('connected wallet data: ', walletData)
//       // Set the account variable to the first and only connected account from the wallet
//       const account = walletData.accounts[0]
//       console.log('account', account)
//       setAccount(account)
//     })
//   }, [rdt])
//
//   return { rdt, api, account }
// }
