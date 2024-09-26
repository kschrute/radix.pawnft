import config from '@/config'

export default function bootstrap(account: string) {
  return `
CALL_METHOD
    Address("${config.faucetComponent}")
    "lock_fee"
    Decimal("5000")
;
CALL_FUNCTION
    Address("${config.packageAddress}")
    "Bootstrap"
    "bootstrap"
;
CALL_METHOD
    Address("${account}")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`
}
