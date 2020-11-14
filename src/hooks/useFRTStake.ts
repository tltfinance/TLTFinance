import { useCallback } from 'react'

import useFRT from './useFRT'
import { useWallet } from 'use-wallet'

import { stake, getPoolContract } from '../pheezez/utilsFRT'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const frt = useFRT()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getPoolContract(frt, pid),
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, frt],
  )

  return { onStake: handleStake }
}

export default useStake
