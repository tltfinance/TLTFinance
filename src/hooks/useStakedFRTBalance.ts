import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import {getFRTStaked, getDigesterContract } from '../pheezez/utils'
import usePheezez from './usePheezez'
import useBlock from './useBlock'


const useStakedFRTBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getFRTStaked(digesterContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, pheezez])

  useEffect(() => {
    if (account && pheezez) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, pheezez])

  return balance
}

export default useStakedFRTBalance
