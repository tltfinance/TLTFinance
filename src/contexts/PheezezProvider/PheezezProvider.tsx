import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Pheezez } from '../../pheezez'

export interface PheezezContext {
  pheezez?: typeof Pheezez
}

export const Context = createContext<PheezezContext>({
  pheezez: undefined,
})

declare global {
  interface Window {
    pheezezliquid: any
  }
}

const PheezezProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [pheezez, setPheezez] = useState<any>()
 
  // @ts-ignore
  window.pheezez = pheezez
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const pheezezLib = new Pheezez(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setPheezez(pheezezLib)
      window.pheezezliquid = pheezezLib
    }
  }, [ethereum])
  
  return <Context.Provider value={{ pheezez }}>{children}</Context.Provider>
}

export default PheezezProvider
