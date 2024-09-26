import type { NFTData, NonFungibleToken } from '@/types'
import transformStateData from '@/utils/transformStateData'
import type {
  StateEntityMetadataPageResponse,
  StateNonFungibleDetailsResponseItem,
} from '@radixdlt/babylon-gateway-api-sdk'

export default function transformNftData<T>(
  resourceMeta: StateEntityMetadataPageResponse,
  data: NFTData[],
): NonFungibleToken<T>[] {
  const result = []

  for (const nftData of data) {
    // console.log('nftData.data.programmatic_json.fields', nftData.data.programmatic_json.fields)
    const nft = {
      id: nftData.non_fungible_id,
      resource: resourceMeta.address,
      type: nftData.data.programmatic_json.type_name,
      data: transformStateData(nftData.data.programmatic_json.fields),
    }
    result.push(nft)
  }

  return result
}
