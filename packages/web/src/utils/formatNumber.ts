export const formatNumber = (
  number: number | string | bigint,
  options: Intl.NumberFormatOptions = { notation: 'standard', maximumFractionDigits: 4 },
) => Intl.NumberFormat('en', options).format(Number(number))
