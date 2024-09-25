'use client'

import useSWR from 'swr'
import type { Loan } from '@/app/api/types'
import fetcher from '@/utils/fetcher'
import { useMemo } from 'react'

export default function useLoans() {
  const { data, error, isLoading } = useSWR<{ loans: Loan[] }>('/api/loans', fetcher)
  const loans = useMemo(() => data?.loans, [data])

  return {
    loans,
    isLoading,
    isError: error,
  }
}
