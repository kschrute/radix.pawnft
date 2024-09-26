'use client'

import { theme } from '@/app/theme'
import { ChakraProvider } from '@chakra-ui/react'
import type React from 'react'
import RadixProvider from '@/providers/RadixProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RadixProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </RadixProvider>
  )
  // return (
  //   <GatewayContext.Provider value={gatewayApiClient}>
  //     <RdtContext.Provider value={radixDappToolkit}>
  //       <ChakraProvider theme={theme}>{children}</ChakraProvider>
  //     </RdtContext.Provider>
  //   </GatewayContext.Provider>
  // )
}
