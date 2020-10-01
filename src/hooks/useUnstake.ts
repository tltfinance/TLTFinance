import { useCallback } from 'react'

import usePheezez from './usePheezez'
import { useWallet } from 'use-wallet'

import { unstake, getDigesterContract } from '../pheezez/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(digesterContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, pheezez],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
