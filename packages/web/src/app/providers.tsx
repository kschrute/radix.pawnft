'use client'

import { theme } from '@/app/theme'
import RadixProvider from '@/providers/RadixProvider'
import { ChakraProvider } from '@chakra-ui/react'
import type React from 'react'

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
