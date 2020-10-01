import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { redeem } from '../pheezez/utils'

const useRedeem = (digesterContract: Contract) => {
  const { account } = useWallet()

  const handleRedeem = useCallback(async () => {
    const txHash = await redeem(digesterContract, account)
    console.log(txHash)
    return txHash
  }, [account, digesterContract])

  return { onRedeem: handleRedeem }
}

export default useRedeem
