# NFT Pawn Shop

It's like a pawn shop, but for NFTs and it's peer-to-peer.

## Demo

https://radix-pawnft.vercel.app

## Design

There are two main components:
 
### LoanRegistry

Instantiated once and holds references to borrower/lender nfts that are used to grant access to loan management throughout its lifecycle. 

### LoanRequest

Instantiated per loan request. It holds the state of a loan during its lifecycle. 

When a loan is requested a borrower puts one or many NFTs as collateral and names their loan terms. And in return they are given an NFT that gives them access to `cancel_request` and `repay_loan` methods. They can either cancel a loan if it hasn't been issued by another party yet or repay it if it has been issued, and they received the payment.

After a loan is requested any other person with enough tokens to cover the requested amount can execute `issue_loan` method to transfer the payment to the account that requested the loan. And they are given a lender NFT that gives them access to `withdraw_payment` and `take_collateral` methods. They can either collect the payment when the loan is paid back in full including interest or take the underlying collateral. 

Both borrower and lender NFTs can be sold/transferred to another parties along with the access rights. For example, a lender could sell a loan that is due some time in the future at a discount.

Also, those NFTs could also be used as collateral. For example, somebody with a few lender NFTs could bundle them together and ask for a loan.

## Features to add later

- [ ] Loan issuance fee
- [ ] Ability to make and take offers on existing loan requests
- [ ] Ability to assess NFTs value and automatically determine loan amount
- [ ] Support auto liquidations for liquid collections
- [ ] Ability to assign risk to each loan based on the collateral value and available liquidity for auto liquidations
- [ ] Ability to package loans within similar risk categories for lenders to deploy their capital more easily based on their risk profile

