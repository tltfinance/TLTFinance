import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getPoolContract } from '../pheezez/utilsFRT'
import useFRT from './useFRT'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const frt = useFRT()
  const poolContract = getPoolContract(frt, pid)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(poolContract, account)
    setBalance(new BigNumber(balance))

  }, [account, frt])

  useEffect(() => {
    if (account && frt) {
      fetchBalance()
    }
  }, [account, setBalance, block, frt])

  return balance
}

export default useStakedBalance
