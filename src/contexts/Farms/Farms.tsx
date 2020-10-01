import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import usePheezez from '../../hooks/usePheezez'

import { bnToDec } from '../../utils'
import { getDigesterContract, getEarned } from '../../pheezez/utils'
import { getFarms } from '../../pheezez/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const pheezez = usePheezez()
  const { account } = useWallet()

  const farms = getFarms(pheezez)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
