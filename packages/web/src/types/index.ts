export * from './nfts'

export interface FieldData {
  field_name: string
  kind: string
  type_name: string
  value?: string | number
  variant_name?: string | number
  fields?: {
    field_name: string
    type_name: string
    fields: {
      field_name: string
      value: string
    }[]
  }[]
}
