# NFT Pawn Shop

## TODO

- [ ] Figure out how to get a list of all account NFTs
- [ ] Get rid of `increment_` methods since those values could be derived from the NFT counts?
- [ ] Get rid of `new_loan_request` in favor of `instantiate_loan_request`
- [ ] Listen to mint events (https://docs.radixdlt.com/docs/scrypto-events)
```
├─ Emitter: Method { node: resource_sim1ngpw9n7lkrdfqd5pgdmrxjvgc7xsdznsj4k8n3zkqgyj3clcvyguqw, module_id: Main }
   Event: MintNonFungibleResourceEvent {
     ids: [
       NonFungibleLocalId("#2#"),
     ],
   }
```

## Features to add later

- [ ] Loan issuance fee
- [ ] Ability to make and take offers on existing loan requests 

## Research

- https://docs.radixdlt.com/docs/learning-to-create-owned-components
- https://docs.radixdlt.com/docs/cross-blueprint-calls#calling-a-specific-blueprint-or-global-component-of-your-package
- https://docs.radixdlt.com/docs/advanced-accessrules
- https://docs.radixdlt.com/docs/scrypto-events

See if I can use this to make sure cross component calls are being made within the same package.

```rust
let my_package: Package = Runtime::package_address().into();
let my_package_description: String = my_package.get_metadata("description").unwrap().unwrap();
```

## Design

- User lists an NFT or a set of NFTs with the desired XRD amount, loan duration and APR. 
  - The contract holds the NFTs until a loan is given or the offer is canceled.
- Other users see the listing and can either accept as is or make counter offers with different amount, duration or APR.
- Once an offer is accepted the NFT(s) are transferred to the loan giver and the loan amount is taken from them.

## Implementation

### LOAN REGISTRY

Global contract that holds the counters and mint loan NFTs.

### LOAN REQUEST

Per loan with authority to mint loan NFTs by calling LOAN REGISTRY.

### UX flow

Borrower deposits NFTs into the component to create a loan request and is given a proof that can be redeemed for the NFTs as long as a loan either has not been issued or has been already paid off.

Lender accepts Borrower's loan request and transfers the funds requested directly (?) to the Borrower and is given a proof (NFT?) of the loan ownership which can be used to repossess collater if the loan is not paid off in time.

After loan expires the Borrower pays back the principal plus interest and exchanges his proof for his NFTs back.

## Deployment

##### Build the scrypto package:

```shell
scrypto build
```

target/wasm32-unknown-unknown/release/

##### Deploy the package to Stokenet:

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet Via the Connect Button
3. Navigate to Deploy Package
4. Upload both `contract.rpd` and `contract.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality yet.
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction. You may have to
   "Customize" which account pays the transaction fee if your account has no
   funds.
9. Once the transaction completes, the deployed _package address_ should then be
   displayed back in the Stokenet Console. Make a note of it for the next step.

#### Creating a dApp Definition

1. Create a new account in the Radix Wallet. This is the account which we will
   convert to a dapp Definition account.
2. Head to the
   [Developer Console’s Manage dApp Definitions page](https://stokenet-console.radixdlt.com/dapp-metadata).
   This page provides a simple interface to set the metadata on an account to
   make it a dapp definition.
3. Connect your Radix Wallet to the Dashboard and select the account you just
   created to be a dapp definition.
4. In the dropdown menu next to "Select Account", make sure the account is the
   same account you created to be a dapp definition.
5. Check the box for "This Account is a dApp Definition".
6. Fill in the name and description. - _icon_url and Linked Websites would be
   essential for any production app, but we're keeping this example as simple as
   we can._
7. Click "Send Update Transaction to the Radix Wallet"
8. An approve transaction should appear in your Radix Wallet to confirm. You may
   have to "Customize" which account pays the transaction fee if your dapp
   definition account has no funds. Confirm the transaction.

#### Instantiate

https://stokenet-console.radixdlt.com/transaction-manifest

```
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "lock_fee"
    Decimal("5000");
CALL_FUNCTION
    Address("package_tdx_2_1p4zmhtfylltgwqwkv3scpfetj6sljjdw3jjtevempww2kefk42kkz7")
    "Contract"
    "instantiate"
    Decimal("0.33");
CALL_METHOD
    Address("account_tdx_2_129rfcsghg74p9ydgk5kf8s04jrvrrytppl46ncpm4gtglwxr2257q3")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>();
```
