import { Debug } from '@/components/Debug'
import RadixDevTools from '@/components/RadixDevTools'
import config from '@/config'
import { Box, Heading } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>Dev</Heading>
      <RadixDevTools />
      <Debug
        data={{
          config,
        }}
      />
    </Box>
  )
}
