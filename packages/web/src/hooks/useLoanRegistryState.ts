import useGatewayRequest from '@/hooks/useGatewayRequest'
import { useRadix } from '@/hooks/useRadix'
import transformStateData from '@/utils/transformStateData'
import { useEffect, useState } from 'react'

type LoanRegistryState = {
  loan_borrower_nft_resource_manager?: string
  loan_lender_nft_resource_manager?: string
  loans_requested_count?: number
  loans_issued_count?: number
  loans_repaid_count?: number
  loans_defaulted_count?: number
}

export default function useLoanRegistryState() {
  const gatewayRequest = useGatewayRequest()
  const [data, setData] = useState<LoanRegistryState>({})
  const { api, account } = useRadix()

  const transformResponse = () => {}

  useEffect(() => {
    ;(async () => {
      const state = await gatewayRequest('/state/entity/details', {
        opt_ins: {
          ancestor_identities: false,
          component_royalty_vault_balance: false,
          package_royalty_vault_balance: false,
          non_fungible_include_nfids: false,
          explicit_metadata: [],
        },
        addresses: ['component_tdx_2_1crpxrvx3k87qa7yl4fehvzxyfqgyu77vrjez2dkl45sv4whql50wt4'],
        aggregation_level: 'Vault',
      })

      setData(transformStateData(state.items[0].details.state.fields))
    })()
  }, [gatewayRequest])

  return data
}
