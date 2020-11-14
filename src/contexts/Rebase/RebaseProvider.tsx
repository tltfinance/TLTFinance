import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useFRT from '../../hooks/useFRT'
import {
  getRebases,
} from '../../pheezez/utilsFRT'

import Context from './Context'

import { RebaseList } from "./types"

const RebaseProvider: React.FC = ({ children }) => {
  const { account } = useWallet()
  const frt = useFRT()

  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false)
  const [rebases, setRebases] = useState<RebaseList[]>()
  
  const fetchRebaseList = useCallback(async () => {
    if (!frt) return;
    let rebs: RebaseList[] = await getRebases(frt);
    rebs = rebs.sort((a, b) => {
      if (a && b && a.date && b.date) {
        if (a.date === b.date) {
          return 0
        }
        if (a.date < b.date) {
          return 1
        } else {
          return -1
        }
      } else {
        return 0
      }

    });
    //console.log("Rebases", rebs)
    setRebases(rebs);
  }, [
    setRebases,
    frt,
  ])
 
  useEffect(() => {
    if (frt) {
      fetchRebaseList()
      let refreshInterval = setInterval(fetchRebaseList, 100000)
      return () => clearInterval(refreshInterval)
    }
  }, [
    frt,
    fetchRebaseList,
  ])

  return (
    <Context.Provider value={{
      rebases: rebases,
      confirmTxModalIsOpen,
    }}>
      {children}
    </Context.Provider>
  )
}

export default RebaseProvider
