import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import usePheezez from './usePheezez'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getDigesterContract } from '../pheezez/utils'

const useAllowance = (lpContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)
 // console.log("WHAT????",lpContract,digesterContract,account )
  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      digesterContract,
      account,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, digesterContract, lpContract])

  useEffect(() => {
    if (account && digesterContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, digesterContract, lpContract])

  return allowance
}

export default useAllowance
