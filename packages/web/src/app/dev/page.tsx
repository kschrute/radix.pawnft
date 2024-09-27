import RadixDevTools from '@/components/RadixDevTools'
import { Box, Heading } from '@chakra-ui/react'
import { Debug } from '@/components/Debug'
import config from '@/config'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>Dev</Heading>
      <RadixDevTools />
      <Debug data={{
        config
      }} />
    </Box>
  )
}
