import { extendTheme } from '@chakra-ui/react'
import { type GlobalStyleProps, mode } from '@chakra-ui/theme-tools'

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', '#180e43')(props),
        lineHeight: 'tall',
      },
    }),
  },
  colors: {
    darkBlue: '#1a202c',
  },
  fonts: {
    heading: 'var(--font-jost)',
    body: 'var(--font-jost)',
  },
})
