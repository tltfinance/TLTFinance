import { useCallback } from 'react'

import useFRT from './useFRT'
import { useWallet } from 'use-wallet'

import { harvest, getPoolContract } from '../pheezez/utilsFRT'

const useFRTReward = (pid: number) => {
  const { account } = useWallet()
  const frt = useFRT()

  //USE the pool ID to fecth all the contracts of the pools
  //USe the contract that you need after.
  const poolContract = getPoolContract(frt, pid)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(poolContract, account)
    console.log(txHash)
    return txHash
  }, [account, frt])

  return { onReward: handleReward }
}

export default useFRTReward
