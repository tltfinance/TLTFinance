import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useFRT from '../../hooks/useFRT'

import { getFarms } from '../../pheezez/utilsFRT'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const frt = useFRT()
  const { account } = useWallet()

  const farms = getFarms(frt)

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
