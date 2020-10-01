import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/logo.png'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import Page from '../../components/Page'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'
import useModal from '../../hooks/useModal'
import usePheezez from '../../hooks/usePheezez'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import { getContract } from '../../utils/erc20'
import { getDigesterContract } from '../../pheezez/utils'
import { proposalStartTime } from '../../pheezez/lib/constants'
import Harvest from './components/Harvest'
import Stake from './components/Stake'

const Farm: React.FC = () => {
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pheezez = usePheezez()
  const { ethereum } = useWallet()

  const [startTime, setStartTime] = useState(proposalStartTime)

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds, completed } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    const paddedDays = days < 10 ? `0${days}` : days
    if (completed)
    {
     return(
         <> 
            <PageHeader
            icon={<i className="fas fa-toilet-paper"/>}
            title="Create prosals, vote and grow the Community!"
          />
          <div>TBD</div>
          
        </>  
          )
    }
    else
    {
    return (
      <>
      
      <StyledCounter>
      Proposals will be ready in
      <span style={{ width: '100%' }}>
        {paddedDays} Days {paddedHours} Hours {paddedMinutes} Minutes {paddedSeconds} Seconds
      </span>
      </StyledCounter>
      </>
    )
    }
  }

  // const lpContract = useMemo(() => {
  //   return getContract(ethereum as provider, lpTokenAddress)
  // }, [ethereum, lpTokenAddress])

  // const { onRedeem } = useRedeem(digesterContract(pheezez))

  // const lpTokenName = useMemo(() => {
  //   return lpToken.toUpperCase()
  // }, [lpToken])

  // const earnTokenName = useMemo(() => {
  //   return earnToken.toUpperCase()
  // }, [earnToken])

  return (
    <Page>
      {!!account ? (
        <>
           
           <Countdown
           date={startTime * 1000}
            renderer={renderer}
           />
      
          
        </>
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
  )
}

const StyledCounter = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  font-family: 'PT Sans', sans-serif;
  flex-direction: column;
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 50px;
  font-weight: 900;
  margin: 0;
  padding: 0;
`

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
