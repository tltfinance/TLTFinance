import { useCallback } from 'react'

import useFRT from './useFRT'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getPoolContract } from '../pheezez/utilsFRT'

const useApprove = (lpContract: Contract, pid: number) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const frt = useFRT()
  const poolContract = getPoolContract(frt, pid)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, poolContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, poolContract])

  return { onApprove: handleApprove }
}

export default useApprove
