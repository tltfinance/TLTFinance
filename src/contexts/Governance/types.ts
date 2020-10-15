import BigNumber from 'bignumber.js'

export interface Proposal {
  gov?: string,
  description?: string,
  state?: string,
  id: number,
  targets: string[],
  signatures: string[],
  inputs: string[][],
  forVotes: number,
  againstVotes: number,
  start?: number,
  end?: number,
  hash: string,
  quorumatPropose: number,
  eta: number
}

export interface ProposalVotingPower {
  hash: string,
  power: number,
  voted: boolean,
  side: boolean
}

export interface Pool {
  pid: number
  name: string
  lpTokenAddress: string
  
}

export interface ContextValues {
  proposals?: Proposal[],
  pools: Pool[],
  votingPowers?: ProposalVotingPower[],
  currentPower?: number,
  isVoting?: boolean,
  confirmTxModalIsOpen?: boolean,
  onVote: (proposal: number, side: boolean) => void,
  onQueue: (proposal: number) => void,
  onExecute: (proposal: number) => void,
  onCancel: (proposal: number) => void,
  onPropose: (targets: string[], values: number[], signatures: string[], inputs: (string|number|boolean)[], action: string, description?: string ) => void
  }
