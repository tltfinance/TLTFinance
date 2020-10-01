import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getDigesterContract } from '../pheezez/utils'
import usePheezez from './usePheezez'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)
  const block = useBlock()
 
  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(digesterContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, digesterContract, pheezez])

  useEffect(() => {
    if (account && digesterContract && pheezez) {
      fetchBalance()
    }
  }, [account, block, digesterContract, setBalance, pheezez])

  return balance
}

export default useEarnings
