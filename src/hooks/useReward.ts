import { useCallback } from 'react'

import usePheezez from './usePheezez'
import { useWallet } from 'use-wallet'

import { harvest, getDigesterContract } from '../pheezez/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(digesterContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, pheezez])

  return { onReward: handleReward }
}

export default useReward
