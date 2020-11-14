import BigNumber from 'bignumber.js'

export interface RebaseList {
  id: number,
  rebaser: string,
  reward: number,
  totalSupply: number,
  hash: string,
  date: number,
}

export interface ContextValues {
  rebases?: RebaseList[],
  confirmTxModalIsOpen?: boolean,
}
