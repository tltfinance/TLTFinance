import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { FRT } from '../../pheezez'

export interface FRTContext {
  frt?: typeof FRT
}

export const Context = createContext<FRTContext>({
  frt: undefined,
})

declare global {
  interface Window {
    frtliquid: any
  }
}

const FRTProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [frt, setFRT] = useState<any>()
 
  // @ts-ignore
  window.frt = frt
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const frtLib = new FRT(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setFRT(frtLib)
      window.frtliquid = frtLib
    }
  }, [ethereum])
  
  return <Context.Provider value={{ frt: frt }}>{children}</Context.Provider>
}

export default FRTProvider
