import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getPoolContract, getFarms, getPools } from '../pheezez/utilsFRT'
import useFRT from './useFRT'
import useBlock from './useBlock'

const useFRTAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const frt = useFRT()
  const pools: Array<any> = getPools(frt)
  const farms = getFarms(frt)
  const contract = getPoolContract(frt,0) //This is only used as a UseEffect dependency
  const block = useBlock()
  let contracts : Array<any> = []

  useEffect(() => {
    let i = 0
    for (i; i < pools.length; i++)
    {
       contracts.push(getPoolContract(frt,i))
     
   }
   //This line is essential to avoid infinite loops on useEffect when having a dependency array.
  // const {current:poolContract} = useRef(contracts)
  }, [contract])

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(frt, contracts[pid], account),
      ),
    )
    setBalance(balances)
  }, [account, contract, frt])

  useEffect(() => {
    if (account && contracts && frt) {
      fetchAllBalances()
    }
  }, [account, block, contract, setBalance, frt])

  return balances
}

export default useFRTAllEarnings
