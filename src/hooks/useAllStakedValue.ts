import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getDigesterContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue,
  getPheezezContract,
} from '../pheezez/utils'
import usePheezez from './usePheezez'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
  pheezezAmount: BigNumber
}
//IT re-renders every block
const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const pheezez = usePheezez()
  const farms = getFarms(pheezez)
  const digesterContract = getDigesterContract(pheezez)
  const wethContact = getWethContract(pheezez)
  const pheezezContract = getPheezezContract(pheezez)
  const block = useBlock()

  //console.log("TEST1", pheezez, farms, digesterContract, wethContact, block )

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
        }) =>
          getTotalLPWethValue(
            digesterContract,
            wethContact,
            lpContract,
            tokenContract,
            pheezezContract,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, digesterContract, pheezez])

  useEffect(() => {
    if (account && digesterContract && pheezez) {
      fetchAllStakedValue()
    }
  }, [account, block, digesterContract, setBalance, pheezez])

  return balances
}

export default useAllStakedValue
