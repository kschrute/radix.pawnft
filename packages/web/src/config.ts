export default {
  xrdResource: process.env.NEXT_PUBLIC_XRD_RESOURCE as string,
  faucetComponent: process.env.NEXT_PUBLIC_FAUCET_COMPONENT as string,
  packageAddress: process.env.NEXT_PUBLIC_PACKAGE_ADDRESS as string,
  loanRegistryComponentAddress: process.env.NEXT_PUBLIC_LOAN_REGISTRY_COMPONENT_ADDRESS as string,
  dappDefinitionAddress: process.env.NEXT_PUBLIC_DAPP_DEFINITION_ADDRESS as string,
}
