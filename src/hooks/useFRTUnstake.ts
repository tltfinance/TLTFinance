import { useCallback } from 'react'

import useFRT from './useFRT'
import { useWallet } from 'use-wallet'

import { unstake, getPoolContract } from '../pheezez/utilsFRT'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const frt = useFRT()
  const poolContract = getPoolContract(frt, pid)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(poolContract, amount, account)
      console.log(txHash)
    },
    [account, frt],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
