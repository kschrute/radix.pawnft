'use client'


import { useRadix } from '@/providers/radix'

export function useSendTransaction() {
  const { rdt, api } = useRadix()
  //   const rdt = React.useContext(RdtContext);
  //   console.log('value', value)

  const sendTransaction = async (manifest: string) => {
    console.log('Manifest: ', manifest)

    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    })
    if (result.isErr()) throw result.error
    console.log('Result: ', result.value)

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await api.transaction.getStatus(result.value.transactionIntentHash)
    console.log('transaction status:', transactionStatus)

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await api.transaction.getCommittedDetails(result.value.transactionIntentHash)

    console.log('committed details:', committedDetails)

    console.log('affected_global_entities:', committedDetails.transaction.affected_global_entities)
  }

  return { sendTransaction }
}
