import { useCallback } from 'react'

import usePheezez from './usePheezez'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getDigesterContract } from '../pheezez/utils'

const useApproveToken = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, digesterContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, digesterContract])

  return { onApproveToken: handleApprove }
}

export default useApproveToken
