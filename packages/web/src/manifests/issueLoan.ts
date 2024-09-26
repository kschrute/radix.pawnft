import config from '@/config'

export default function issueLoan(account: string, loanRequestComponent: string, amount: number) {
  return `
CALL_METHOD
    Address("${config.faucetComponent}")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD 
    Address("${account}")
    "withdraw"    
    Address("${config.xrdResource}")
    Decimal("${amount}")
;
TAKE_ALL_FROM_WORKTOP
    Address("${config.xrdResource}")
    Bucket("xrd")
;
CALL_METHOD
    Address("${loanRequestComponent}")
    "issue_loan"
    Bucket("xrd")
;
CALL_METHOD
    Address("${account}")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
CALL_METHOD
    Address("${account}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`
}
