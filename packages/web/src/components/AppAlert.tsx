import {
  Alert,
  AlertDescription,
  AlertIcon,
  type AlertProps,
  type AlertStatus,
  AlertTitle,
  Box,
} from '@chakra-ui/react'
import type { ReactNode } from 'react'

type Props = {
  title?: string | JSX.Element
  description?: string | JSX.Element
  icon?: JSX.Element
  status?: AlertStatus
  button?: JSX.Element | null
  children?: ReactNode
} & AlertProps

export default function AppAlert({ title, description, icon, button, status = 'warning', children, ...rest }: Props) {
  return (
    <Alert my={5} rounded={10} variant="subtle" status={status} {...rest}>
      {icon || <AlertIcon />}
      <Box flex={1} mr={2}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
      </Box>
      {button}
      {children}
    </Alert>
  )
}
