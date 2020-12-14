import { useCallback } from 'react'

import usePheezez from './usePheezez'
import { useWallet } from 'use-wallet'

import { stake, getDigesterContract } from '../pheezez/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const pheezez = usePheezez()

  const handleStake = useCallback(
    async (amount: string, amountFRT: string) => {
      const txHash = await stake(
        getDigesterContract(pheezez),
        pid,
        amount,
        amountFRT,
        account,
      )
      console.log(txHash)
    },
    [account, pid, pheezez],
  )

  return { onStake: handleStake }
}

export default useStake
