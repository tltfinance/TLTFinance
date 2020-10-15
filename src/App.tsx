import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import PheezezProvider from './contexts/PheezezProvider'
import GovProvider from './contexts/Governance'
import useModal from './hooks/useModal'
import theme from './theme'
import Farms from './views/Farms'
import Home from './views/Home'
import Governance from './views/Governance'
import TSParticles from './components/Particles/Particles'


const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])
 //console.log("MENU", mobileMenu)
  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (


    <Providers>
    
      <Router>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh"
          }}
        >
            <TSParticles/>
           
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
          >
            <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
            <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/farms">
                <Farms />
              </Route>
              <Route path="/gov">
                <Governance />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
      <Disclaimer />
    </Providers >

  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider
        chainId={1}
        connectors={{
          walletconnect: { rpcUrl: "https://mainnet.infura.io/v3/08ba145cba70427c8c6957bae1fce0cd" },
        }}
      >
        <PheezezProvider>
          <TransactionProvider>
            <FarmsProvider>
            <GovProvider>
              <ModalsProvider>{children}
              </ModalsProvider>
              </GovProvider>
            </FarmsProvider>
          </TransactionProvider>
        </PheezezProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

const Disclaimer: React.FC = () => {
  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(
    <DisclaimerModal onConfirm={markSeen} />,
  )

  useEffect(() => {
    const seenDisclaimer = true // localStorage.getItem('disclaimer')
    if (!seenDisclaimer) {
      onPresentDisclaimerModal()
    }
  }, [])

  return <div />
}

export default App
