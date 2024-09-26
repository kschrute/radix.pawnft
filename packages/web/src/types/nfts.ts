export interface NonFungibleToken<T> {
  id: string
  type: string
  data: T
}

export interface BorrowerNFTData {
  component: string
  receiver: string
  amount: number
  total_amount: number
  duration: number
  apr: number
  maturity_date: string
  closed_date: string
  status: string
}

export interface LenderNFTData {
  component: string
  status: string
}

export type BorrowerNFT = NonFungibleToken<BorrowerNFTData>

export type LenderNFT = NonFungibleToken<BorrowerNFTData>
