import { RadixContext } from '@/providers/RadixProvider'
import { DataRequestBuilder, type WalletDataStateAccount } from '@radixdlt/radix-dapp-toolkit'
import React, { useEffect, useState } from 'react'

export function useRadix() {
  const [account, setAccount] = useState<WalletDataStateAccount>()

  const { api, rdt } = React.useContext(RadixContext)

  useEffect(() => {
    rdt?.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1))
    // Subscribe to updates to the user's shared wallet data, then display the account name and address.
    rdt?.walletApi.walletData$.subscribe((walletData) => {
      // console.log('connected wallet data: ', walletData)
      // Set the account variable to the first and only connected account from the wallet
      const account = walletData.accounts[0]
      // console.log('account', account)
      setAccount(account)
    })
  }, [rdt])

  return { api, rdt, account }
}
