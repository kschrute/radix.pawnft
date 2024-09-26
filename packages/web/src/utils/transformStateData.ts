import type { FieldData } from '@/types'

export default function transformStateData<T>(data: FieldData[]): T {
  const result = {}

  for (const field of data) {
    let value: string | number | Date | undefined = field.value ?? field.variant_name ?? 'Unknown'

    if (field.type_name === 'Option') {
      const fields = field.fields
      const firstField = field.fields && field.fields.length > 0 ? field.fields[0] : undefined

      if (firstField?.type_name === 'UtcDateTime') {
        const [year, month, day, hour, minute, second] = firstField.fields
        value = new Date(
          Date.UTC(
            Number(year.value),
            Number(month.value),
            Number(day.value),
            Number(hour.value),
            Number(minute.value),
            Number(second.value),
          ),
        )
      } else {
        value = firstField ? 'Unknown' : undefined
      }
    }

    // @ts-ignore
    result[field.field_name] = value
  }

  // @ts-ignore
  return result
}
