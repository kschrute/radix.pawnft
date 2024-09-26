import RadixDevTools from '@/components/RadixDevTools'
import { Box, Heading } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>Dev</Heading>
      <RadixDevTools />
    </Box>
  )
}
