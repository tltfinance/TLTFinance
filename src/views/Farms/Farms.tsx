import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import Button from '../../components/Button'
import Page from '../../components/Page'
import Card from '../../components/Card'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'
import pheezezLogo from '../../assets/img/metamask-fox.svg'
import FRTLogo from '../../assets/img/wallet-connect.svg'

import useModal from '../../hooks/useModal'
import Farm from '../Farm'
import FRTFarm from '../FRTFarm'

import FarmCards from './components/FarmCards'
import FRTFarms from './components/FRTFarms'
import CardContent from '../../components/CardContent'
import CardIcon from '../../components/CardIcon'
import CardTitle from '../../components/CardTitle'
import Spacer from '../../components/Spacer'


const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWallet()
  const [farm, setFarm] = useState('')
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
  
  const handlePHZTClick = useCallback(() => {
    setFarm('PHZT')
  }, [setFarm])

  const handleFRTClick = useCallback(() => {
    setFarm('FRT')
  }, [setFarm])

  return (
    <Switch>
      <Page>
        {!!account ? (
          (farm === '') && (
            <>
              <PageHeader
                icon={<i className="fas fa-toilet-paper" />}
                subtitle="Welcome to our Toilet."
                title="What do you want to farm?"
              />
             <StyledWalletsWrapper>
             <StyledWalletCard>
              <Card>
                <CardContent>
                  <CardIcon>{<img src={pheezezLogo} style={{ height: 32 }} />}</CardIcon>
                  <CardTitle text="Farm PHZT" />
                  <Spacer />
                  <Button onClick={handlePHZTClick} text="Select PHZT" />
                </CardContent>
              </Card>
              </StyledWalletCard>
              <Spacer size="sm" />
              <Spacer size="sm" />
              <StyledWalletCard>
              <Card>
              <CardContent>
                  <CardIcon>{<img src={FRTLogo} style={{ height: 32 }} />}</CardIcon>
                  <CardTitle text="Farm FRT" />
                  <Spacer />
                  <Button onClick={handleFRTClick} text="Select FRT" />
                </CardContent>
              </Card>
              </StyledWalletCard>
              </StyledWalletsWrapper>
            </>

          ) ||
          (farm === 'PHZT') &&
          (
            <>
              <Route exact path={path}>
                <PageHeader
                  icon={<i className="fas fa-toilet-paper" />}
                  subtitle="Earn PHZT by staking Uniswap V2 LP Tokens."
                  title="Select Your Pool"
                />
                <FarmCards />
              </Route>
              <Route path={`${path}/:farmId`}>
                <Farm />
              </Route>
            </>
          )  ||
          (farm === 'FRT') &&
          (
            <>
              <Route exact path={path}>
                <PageHeader
                  icon={<i className="fas fa-toilet-paper" />}
                  subtitle="We  have 3 pools for you to earn FRT."
                  title="Select Your Pool"
                />
                <FRTFarms />
              </Route>
              <Route path={`${path}/:farmId`}>
                <FRTFarm />
              </Route>
            </>
          )

        ) : (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Button
                onClick={onPresentWalletProviderModal}
                text="Unlock Wallet"
                variant='tertiary'
              />
            </div>
          )}
      </Page>
    </Switch>
  )
}

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    flex-wrap: none;
  }
`
const StyledWalletCard = styled.div`
  flex-basis: calc(50% - ${(props) => props.theme.spacing[2]}px);
  border-radius: 1rem;
  width: 300px;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
`

export default Farms
