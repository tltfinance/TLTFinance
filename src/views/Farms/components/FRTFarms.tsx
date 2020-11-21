import BigNumber from 'bignumber.js'
import React, { useEffect, useState, useRef } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/FRTFarms'
import useAllStakedValueFRT, {
  StakedValue,
} from '../../../hooks/useFRTAllStakedValue'
import useFRTFarms from '../../../hooks/useFRTFarms'
import useFRT from '../../../hooks/useFRT'
import usePheezez from '../../../hooks/usePheezez'
import { getEarned, getPoolContract, getCurrentFRTPerBlock, getPools, getFRTDAIValue, getFRTDAIContract } from '../../../pheezez/utilsFRT'
import { bnToDec } from '../../../utils'
import { getpheezezethContract, getethusdContract, calculateTokenUSDValue } from '../../../pheezez/utils'
import { stakingStartTime } from '../../../pheezez/lib/constants'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

const FRTFarms: React.FC = () => {
  const [farms] = useFRTFarms()
  const { account } = useWallet()
  const stakedValue = useAllStakedValueFRT()
  const frt = useFRT()
  const frtdaiContract = getFRTDAIContract(frt)
  const [frtdai, setFRTDAI] = useState(new BigNumber(0))
  const [currentReward, setCurrentReward] = useState([] as Array<BigNumber>)
  const pools = getPools(frt)
  const pheezez = usePheezez()
  const contract = getPoolContract(frt, 0) //This is only used as a UseEffect dependency
  const pheezezethContract = getpheezezethContract(pheezez)
  const ehtusdContract = getethusdContract(pheezez)
  const [phztPrice, setTokenPrice] = useState(0)
  const contracts: Array<any> = []

  useEffect(() => {
    async function fetchTokenPrice() {
      const price = await calculateTokenUSDValue(ehtusdContract, pheezezethContract)
      setTokenPrice(price)
    }
    if (ehtusdContract && pheezezethContract) {
      fetchTokenPrice()
    }
  }, [ehtusdContract, pheezezethContract, setTokenPrice])


  useEffect(() => {
    let i = 0
    for (i; i < pools.length; i++) {
      contracts.push(getPoolContract(frt, i))

    }
    //This line is essential to avoid infinite loops on useEffect when having a dependency array.
    // const {current:poolContract} = useRef(contracts)
  }, [contract])

  const frtIndex = farms.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'FRT',
  )

  const tokenPrice = frtdai


  useEffect(() => {
    async function fetchFRTPrice() {
      const price = new BigNumber(await getFRTDAIValue(frtdaiContract))
      setFRTDAI(price)
    }
    if (frtdaiContract) {
      fetchFRTPrice()
    }
  }, [frtdaiContract, setFRTDAI])


  useEffect(() => {
    async function fetchCurrentTokensPerBlock() {
      let reward = new BigNumber(0)
      let rewardArray: Array<BigNumber> = []
      for (let i = 0; i < pools.length; i++) {
        reward = await getCurrentFRTPerBlock(frt, contracts[i])
        //console.log("rewardssss11111111111",reward.toNumber())
        reward = reward.multipliedBy(new BigNumber(13)).dividedBy(new BigNumber(10).pow(18))
        rewardArray.push(reward)
      }

      setCurrentReward(rewardArray)
    }
    if (contracts) {
      fetchCurrentTokensPerBlock()
    }
  }, [contract, setCurrentReward])

  const BLOCKS_PER_YEAR = new BigNumber(2336000)
  const FRT_PER_BLOCK = currentReward //get them from the contract!!!

  //console.log("rewardssss",FRT_PER_BLOCK)

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? tokenPrice
            .times(FRT_PER_BLOCK[i])
            .times(BLOCKS_PER_YEAR)
            .times(stakedValue[i].poolWeight)
            .div(stakedValue[i].totalDaiValue.toNumber() > 0 ? (stakedValue[i].totalDaiValue)
              : stakedValue[i].totalWethValue.toNumber() > 0 ? (stakedValue[i].totalWethValue)
                : stakedValue[i].tokenAmount.times(phztPrice))
          : null,
      }

      if (stakedValue[i] && FRT_PER_BLOCK[i]) {
       // console.log("FARMS", phztPrice, tokenPrice.toNumber(), stakedValue[i].poolWeight.toNumber(), FRT_PER_BLOCK[i].toNumber(), stakedValue[i].tokenAmount.times(phztPrice).toNumber())
      }

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
  const frt = useFRT()

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
      if (frt) return
      const earned = await getEarned(frt,
        getPoolContract(frt, farm.pid),
        account,
      )

      setHarvestable(bnToDec(earned))
    }
    if (frt && account) {
      fetchEarned()
    }
  }, [frt, account, setHarvestable])

  const poolActive = farm.starttime * 1000 - Date.now() <= 0
  //console.log("DATE", Date.now(), poolActive)
  let animate: boolean
  let sizu: 'sm' | 'md'
  switch (farm.tokenSymbol) {
    case 'PHZT':
      sizu = 'sm'
      break
    default:
      sizu = 'md'
  }


  let mult: string
  switch (farm.tokenSymbol) {
    case 'FRT':
      mult = '5x'
      break
    case 'USDT':
      mult = '1x'
      break
    case 'KIMCHI':
      mult = '1.5x'
      break
    case 'GODKIMCHI':
      mult = '2x'
      break
    case 'PICKLE':
      mult = '2.5x'
      break
    case 'SHROOM':
      mult = '2.5x'
      break
    case 'SUSHI':
      mult = '3x'
      break
    case 'SAKE':
      mult = '3x'
      break
    case 'PADTHAI':
      mult = '1x'
      break
  }

  return (
    <div>
      <StyledCardWrapper>
        {farm.tokenSymbol === 'FRT' ? animate = true : animate = false}

        <Card animation={animate} variant='secondary'>
          <BackgroundSquare />
          <CardContent>
            <StyledContent>
              <CardIcon size={sizu} label={mult} variant='secondary'>
                <Spaner>{<img src={farm.icon} height={50} alt="Logo" />}</Spaner>
                { (sizu === 'md') &&
                (<Spaner>{<img src={farm.icon2} height={50} alt="Logo" />}</Spaner>)
                }
              </CardIcon>
              <StyledTitle>{farm.name}</StyledTitle>
              <StyledDetails>
                <StyledDetail>Deposit {farm.poolToken.toUpperCase()}</StyledDetail>
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
                      date={new Date(farm.starttime * 1000)}
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
      { (farm.unipool != "") && (
        <Footnote>
          <StyledAbsoluteLink
            href={farm.unipool}
            target="_blank"
          >
            Get Uniswap LP Token
      </StyledAbsoluteLink>

        </Footnote>
      )
      }
    </div>
  )
}

const StyledAbsoluteLink = styled.a`
color: ${(props) => props.theme.color.grey[906]};
text-decoration: none;
width: 100%;
&:hover {
  color: ${(props) => props.theme.color.grey[905]};
  border-radius: 4px;
  transition: all 0.2s ease-out;
}
&.active {
  color: ${(props) => props.theme.color.grey[906]};
  transition: all 0.2s ease-out;
  text-shadow: 2px 2px 4px #000000;
}
`

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
const Footnote = styled.div`
  z-index: 3;
  position: relative;
  top: -37px;
  text-align: center;
  font-size: 18px;
  font-size: 20px;
  color: ${(props) => props.theme.color.grey[906]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`
export default FRTFarms
