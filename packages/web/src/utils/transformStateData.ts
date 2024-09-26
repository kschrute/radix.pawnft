type StateData = {
  field_name: string
  kind: string
  type_name: string
  value?: string | number
  variant_name?: string | number
}

export default function transformStateData(data: StateData[]) {
  const result = {}
  for (const field of data) {
    // @ts-ignore
    result[field.field_name] = field.value ?? field.variant_name ?? 'Unknown'
  }
  return result
}
