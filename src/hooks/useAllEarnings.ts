import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getDigesterContract, getFarms } from '../pheezez/utils'
import usePheezez from './usePheezez'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const pheezez = usePheezez()
  const farms = getFarms(pheezez)
  const digesterContract = getDigesterContract(pheezez)
  const block = useBlock()
  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(digesterContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, digesterContract, pheezez])

  useEffect(() => {
    if (account && digesterContract && pheezez) {
      fetchAllBalances()
    }
  }, [account, block, digesterContract, setBalance, pheezez])

  return balances
}

export default useAllEarnings
