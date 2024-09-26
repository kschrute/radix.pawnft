import type { FieldData } from '@/types/index'

export interface NFTData {
  data: {
    programmatic_json: {
      type_name: string
      fields: FieldData[]
    }
  }
  non_fungible_id: string
}

export interface NonFungibleToken<T> {
  id: string
  resource: string
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
  maturity_date?: Date
  closed_date?: Date
  status: string
}

export interface LenderNFTData {
  component: string
  status: string
}

export type UnknownNFT = NonFungibleToken<Record<string, unknown>>

export type BorrowerNFT = NonFungibleToken<BorrowerNFTData>

export type LenderNFT = NonFungibleToken<LenderNFTData>
