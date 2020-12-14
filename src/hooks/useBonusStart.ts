import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { bonusStart, getDigesterContract } from '../pheezez/utils'
import usePheezez from './usePheezez'
import useBlock from './useBlock'

const useBonusStart = (pid: number) => {
  const [bonusDate, setBonusDate] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const pheezez = usePheezez()
  const digesterContract = getDigesterContract(pheezez)
  const block = useBlock()

  const fetchBonusDateStart = useCallback(async () => {
    const bonus = await bonusStart(digesterContract, pid, account)
    setBonusDate(new BigNumber(bonus))
  }, [account, pid, pheezez])

  useEffect(() => {
    if (account && pheezez) {
      fetchBonusDateStart()
    }
  }, [account, pid, setBonusDate, block, pheezez])

  return bonusDate
}

export default useBonusStart
