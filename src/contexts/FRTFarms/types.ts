import { Contract } from 'web3-eth-contract'

export interface Farm {
  pid: number
  name: string
  poolToken: string
  lpTokenAddress: string
  lpContract: Contract
  poolAddress: string
  frtPoolContract: Contract
  tokenAddress: string
  earnToken: string
  earnTokenAddress: string
  icon: string
  icon2: string
  id: string
  tokenSymbol: string
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
}
