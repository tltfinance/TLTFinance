import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import usePheezez from '../../../hooks/usePheezez'
import { getEarned, getDigesterContract } from '../../../pheezez/utils'
import { bnToDec } from '../../../utils'
import {stakingStartTime} from '../../../pheezez/lib/constants'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

const FarmCards: React.FC = () => {
  const [farms] = useFarms()
  const { account } = useWallet()
  const stakedValue = useAllStakedValue()

  const pheezezIndex = farms.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'PHZT',
  )

  const tokenPrice =
    pheezezIndex >= 0 && stakedValue[pheezezIndex]
      ? stakedValue[pheezezIndex].tokenPriceInWeth
      : new BigNumber(0)
  //console.log("PRIZZZEEEE", tokenPrice.toNumber(), pheezezIndex)

  const BLOCKS_PER_YEAR = new BigNumber(2336000)
  const PHEEZEZ_PER_BLOCK = new BigNumber(100) //Update this, get them from the contract!!!

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? tokenPrice
            .times(PHEEZEZ_PER_BLOCK)
            .times(BLOCKS_PER_YEAR)
            .times(stakedValue[i].poolWeight)
            .div(stakedValue[i].totalWethValue.toNumber() === 0 ? (stakedValue[i].tokenAmount.times(tokenPrice).times(new BigNumber(2))) : stakedValue[i].totalWethValue)
          : null,
      }
      //Explanation of above calculation. Sometimes the LP pairs do not have Eth value, so we need to get the current ether value of these tokens by
      //multiplying the Token Amount by the Pheezez price, by 2 (Because of the value of the pools)
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
          <StyledLoadingWrapper>
            <Loader text="Loading Farms ..." />
          </StyledLoadingWrapper>
        )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(stakingStartTime)
  const [harvestable, setHarvestable] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const pheezez = usePheezez()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    const paddedDays = days < 10 ? `0${days}` : days
    return (
      <span style={{ width: '100%' }}>
        {paddedDays}:{paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchEarned() {
      if (pheezez) return
      const earned = await getEarned(
        getDigesterContract(pheezez),
        lpTokenAddress,
        account,
      )
      
      setHarvestable(bnToDec(earned))
    }
    if (pheezez && account) {
      fetchEarned()
    }
  }, [pheezez, lpTokenAddress, account, setHarvestable])
  
  const poolActive = startTime * 1000 - Date.now() <= 0
  //console.log("DATE", Date.now(), poolActive)
  var animate: boolean

  return (
    <StyledCardWrapper>
      {farm.tokenSymbol === 'PHZT' ? animate = true : animate = false}
      <Card animation = {animate}>
        <BackgroundSquare/>
        <CardContent>
          <StyledContent>
            <CardIcon size='md'>
              <Spaner>{<img src={farm.icon} height={55} alt="Logo" />}</Spaner>
              <Spaner>{<img src={farm.icon2} height={55} alt="Logo" />}</Spaner>
            </CardIcon>
            <StyledTitle>{farm.name}</StyledTitle>
            <StyledDetails>
              <StyledDetail>Deposit {farm.lpToken.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn {farm.earnToken.toUpperCase()}</StyledDetail>
            </StyledDetails>
            <Spacer />
            <StyledButtonWrapper>
              <Button
                disabled={!poolActive}
                text={poolActive ? 'Select' : undefined}
                to={`/farms/${farm.id}`}
                size='md'
              >
                {!poolActive && (
                  <Countdown
                    date={new Date(startTime * 1000)}
                    renderer={renderer}
                  />
                )}
              </Button>
            </StyledButtonWrapper>
            <StyledInsight>
              <span>APY</span>
              <span>
                {farm.apy
                  ? `${farm.apy
                    .times(new BigNumber(100))
                    .toNumber()
                    .toLocaleString('en-US')
                    .slice(0, -1)}%`
                  : 'Loading ...'}
              </span>
            </StyledInsight>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}


const Spaner = styled.span`
 float:right;
 margin-left:5px;
 margin-right:5px;
 margin-top:10px;
`
const StyledButtonWrapper = styled.div`
  z-index: 3;
  width:50%;
`
const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`
const BackgroundSquare = styled.div`
  position: absolute;
  z-index: 2;
  top: 60%;
  width: 150%;
  height: 100%;
  background-color: ${(props) => props.theme.color.grey[903]};
  transform: rotate(-3deg);
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

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[910]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 1.2rem;
  text-shadow: 2px 2px 4px #000000;
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: ${(props) => props.theme.color.grey[700]};
  color: ${(props) => props.theme.color.grey[907]};
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #6568F4;
  text-align: center;
  padding: 0 12px;
`

export default FarmCards
