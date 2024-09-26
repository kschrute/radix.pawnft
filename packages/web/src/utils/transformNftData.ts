import type { NonFungibleToken } from '@/types'
import transformStateData from '@/utils/transformStateData'

type FieldData = {
  field_name: string
  kind: string
  type_name: string
  value: string | number
}

type NFTData = {
  data: {
    programmatic_json: {
      type_name: string
      fields: FieldData[]
    }
  }
  non_fungible_id: string
}

export default function transformNftData<T>(data: NFTData[]): NonFungibleToken<T>[] {
  const result = []

  for (const nftData of data) {
    const nft = {
      id: nftData.non_fungible_id,
      type: nftData.data.programmatic_json.type_name,
      data: transformStateData(nftData.data.programmatic_json.fields),
    }
    result.push(nft)
  }

  return result
}
