import config from '@/config'

export default function instantiateLoanRegistry(account: string) {
  return `
CALL_FUNCTION
    Address("${config.packageAddress}")
    "LoanRegistry"
    "instantiate_loan_registry"
;
CALL_METHOD
    Address("${account}")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`
}
