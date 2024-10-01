import config from '@/config'

export default function debug(account: string) {
  return `
CALL_FUNCTION
    Address("${config.loanRegistryComponentAddress}")
    "test"
;
CALL_METHOD
    Address("${account}")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`
}
