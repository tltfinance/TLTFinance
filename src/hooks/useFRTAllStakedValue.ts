import { useCallback, useEffect, useState, useRef } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getPoolContract,
  getDaiContract,
  getFarms,
  getTotalStakedValue,
  getFRTContract,
  getPools,
} from '../pheezez/utilsFRT'

import {
  getWethContract,
} from '../pheezez/utils'
import useFRT from './useFRT'
import usePheezez from './usePheezez'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  daiAmount: BigNumber
  wethAmount: BigNumber
  tokenLPAmount: BigNumber
  totalDaiValue: BigNumber
  totalWethValue: BigNumber
  tokenPriceInDai: BigNumber
  tokenPRiceinEther: BigNumber
  poolWeight: BigNumber
  frtAmount: BigNumber
}
//IT re-renders every block
const useAllStakedValueFRT = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const frt = useFRT()
  const pheezez = usePheezez()
  const farms = getFarms(frt)
  const pools: Array<any> = getPools(frt)
  const contract = getPoolContract(frt,0) //This is only used as a UseEffect dependency
  let contracts : Array<any> = []
  const daiContract = getDaiContract(frt)
  const frtContract = getFRTContract(frt)
  const wethContract = getWethContract(pheezez)
  const block = useBlock()

  useEffect(() => {
    let i = 0
    for (i; i < pools.length; i++)
    {
       contracts.push(getPoolContract(frt,i))
     
   }
   //This line is essential to avoid infinite loops on useEffect when having a dependency array.
  // const {current:poolContract} = useRef(contracts)
  }, [contract])

  //console.log("TEST1", frt, balances )

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          frtPoolContract,
          tokenContract,
          lpContract,
        }: {
          pid: number
          frtPoolContract: Contract
          tokenContract: Contract
          lpContract: Contract
        }) =>
        getTotalStakedValue(
            contracts[pid],
            daiContract,
            wethContract,
            frtPoolContract,
            tokenContract,
            frtContract,
            lpContract,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, contract, frt])

  useEffect(() => {
    if (account && contracts && frt) {
      fetchAllStakedValue()
    }
  }, [account, block, contract, setBalance, frt])

  return balances
}

export default useAllStakedValueFRT
