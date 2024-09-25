import { Box, Heading } from '@chakra-ui/react'
import RadixDevTools from '@/components/RadixDevTools'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>Dev</Heading>
      <RadixDevTools />
    </Box>
  )
}
