import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import usePheezez from '../../hooks/usePheezez'
import { getDigesterContract } from '../../pheezez/utils'
import { getContract } from '../../utils/erc20'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import Button from '../../components/Button'
import { DivMode } from 'react-tsparticles'

const Farm: React.FC = () => {
  const { farmId } = useParams()
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    earnToken,
    name,
    icon,
    icon2,
    unipool,
  } = useFarm(farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    icon2: '',
    unipool: '',
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pheezez = usePheezez()
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const { onRedeem } = useRedeem(getDigesterContract(pheezez))

  const lpTokenName = useMemo(() => {
    return lpToken.toUpperCase()
  }, [lpToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])

  return (
    <>
      <PageHeader
        icon={<img src={icon} height="120" alt="Logo" />}
        icon2={<img src={icon2} height="120" alt="Logo" />}
        subtitle={`Deposit ${lpTokenName}  Tokens and earn ${earnTokenName}`}
        title={name}
      />
      <StyledFarm>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <BackgroundSquare />
            <Harvest pid={pid} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <BackgroundSquare />
            <Stake
              lpContract={lpContract}
              pid={pid}
              tokenName={lpToken.toUpperCase()}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer />
        <div>
          <Button
            size="md"
            text={`${lpTokenName} pair at Uniswap`}
            href={unipool}

          />
        </div>
        <Spacer size="lg" />
        <StyledInfo>
          Witdrawal of earned Tokens is executed whenever LP Tokens are staked or unstaked!
        </StyledInfo>
        <Spacer size="lg" />
      </StyledFarm>
    </>
  )
}

const BackgroundSquare = styled.div`
  position: absolute;
  z-index: 2;
  top: 70%;
  width: 150%;
  height: 100%;
  background-color: ${(props) => props.theme.color.grey[904]};
  transform: rotate(-3deg);
 
`

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledCardsWrapper = styled.div`
display: flex;
margin-bottom: ${(props) => props.theme.spacing[4]}px;
flex-flow: row wrap;
@media (max-width: 768px) {
  width: 100%;
  flex-flow: column nowrap;
  align-items: center;
}
`

const StyledCardWrapper = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[909]};
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`

export default Farm
