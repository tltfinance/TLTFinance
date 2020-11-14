import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getPoolContract } from '../pheezez/utilsFRT'
import useFRT from './useFRT'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const frt = useFRT()
  const poolContract = getPoolContract(frt, pid)
  const block = useBlock()
 
  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(frt, poolContract, account)
    setBalance(new BigNumber(balance))
  }, [account, poolContract, frt])

  useEffect(() => {
    if (account && poolContract && frt) {
      fetchBalance()
    }
  }, [account, block, poolContract, setBalance, frt])

  return balance
}

export default useEarnings
