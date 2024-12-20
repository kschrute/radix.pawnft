export const addDays = (days: number, fromDate?: Date) => {
  const date = fromDate ? new Date(fromDate.valueOf()) : new Date()
  date.setDate(date.getDate() + Math.abs(days))
  return date
}
