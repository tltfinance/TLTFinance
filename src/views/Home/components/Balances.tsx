import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import useTokenBalance from '../../../hooks/useTokenBalance'
import usePheezez from '../../../hooks/usePheezez'
import {
  getPheezezAddress,
  getPheezezSupply,
  getCurrentTokensPerBlock,
  getDigesterContract,
  getethusdContract,
  getpheezezethContract,
  calculateTokenUSDValue,
  calculateEtherUSDValue
} from '../../../pheezez/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import Container from '../../../components/Container'


let ethUsd = 0
let tokenUsd = 0
let stakedValue = 0


const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}

const TokenPrice: React.FC = () => {
  const [start, setStart] = useState(0)
  const pheezez = usePheezez()
  const pheezezethContract = getpheezezethContract(pheezez)
  const ehtusdContract = getethusdContract(pheezez)
  const [tokenPrice, setTokenPrice] = useState(0)

  useEffect(() => {
    async function fetchTokenPrice() {
      const price = await calculateTokenUSDValue(ehtusdContract, pheezezethContract)
      setTokenPrice(price)
    }
    if (ehtusdContract && pheezezethContract) {
      fetchTokenPrice()
    }
  }, [ehtusdContract, pheezezethContract, setTokenPrice])

  tokenUsd = tokenPrice
  return (
    <StyledPrice>
      $
      <CountUp
        start={start}
        end={tokenPrice}
        decimals={tokenPrice < 0 ? 4 : tokenPrice > 1e5 ? 0 : 4}
        duration={1}
        separator=","
      />
    </StyledPrice>
  )
}

const TotalStaked: React.FC = () => {
  const [start, setStart] = useState(0)
  const pheezez = usePheezez()
  const ehtusdContract = getethusdContract(pheezez)
  const [ethUsd, setEthUsd] = useState(0)

  useEffect(() => {
    async function fetchEthPrice() {
      const price = await calculateEtherUSDValue(ehtusdContract)
      setEthUsd(price)
    }
    if (ehtusdContract) {
      fetchEthPrice()
    }
  }, [ehtusdContract, setEthUsd])
  //Check about this hook that keeps rerendering
  const allStakedValue = useAllStakedValue()
  let sumTokenEth = 0
  let sumToken = 0
  let sumWeth = 0
  /////Logic for calculating the price of the total LP tokens staked in the pool***///////////////////
  if (allStakedValue && allStakedValue.length) {
    allStakedValue.forEach((element, index) => {
      //  console.log(`Current index: ${index}`);
      //  console.log(element.wethAmount.toNumber(), element.tokenAmount.toNumber());
      if (element.tokenPriceInWeth.toNumber() === 0 && element.tokenAmount.toNumber() > 0) {
        sumToken += element.tokenAmount.times(tokenUsd).toNumber()  //To find the value of tokens that do not have an Ether pair in their LP. (PHEEZEZ)
        // console.log("TEST%%%", sumToken, tokenUsd)
      }
      else {
        sumWeth += element.wethAmount.toNumber()
      }
    });
    sumToken = sumToken * 2
    sumTokenEth = (sumWeth * ethUsd) * 2
    stakedValue = sumToken + sumTokenEth

  }

  //console.log("ASTAKED VALUE", stakedValue, tokenUsd, sumTokenEth)
  return (
    <StyledPrice>
      $
      <CountUp
        start={start}
        end={stakedValue}
        decimals={stakedValue < 0 ? 4 : stakedValue > 1e5 ? 0 : 3}
        duration={1}
        separator=","
      />
    </StyledPrice>
  )
}

const Balances: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [currentReward, setCurrentReward] = useState<BigNumber>()
  const pheezez = usePheezez()
  const pheezezBalance = useTokenBalance(getPheezezAddress(pheezez))
  const digesterContract = getDigesterContract(pheezez)
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()
 //console.log("BALANCE1", pheezezBalance.toNumber())
  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getPheezezSupply(pheezez)
      setTotalSupply(supply)
    }
    if (pheezez) {
      fetchTotalSupply()
    }
  }, [pheezez, setTotalSupply])

  //Obtain current rewards and displays it dynamically in home
  useEffect(() => {
    async function fetchCurrentTokensPerBlock() {
      const reward = await getCurrentTokensPerBlock(digesterContract)
      setCurrentReward(reward)
    }
    if (digesterContract) {
      fetchCurrentTokensPerBlock()
    }
  }, [digesterContract, setCurrentReward])

  return (
    <StyledWrapper>
      <Container size = 'rsm'>
        <StyledCardWrapper>
        <BackgroundSquare/>
        <Card>
           <CardContent>
            <StyledBalances>
              <StyledBalance>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Your PHZT Balance" />
                  <Value
                    value={!!account ? getBalanceNumber(pheezezBalance) : 'Locked'}
                  />
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
          <Footnote>
            Pending rewards
          <FootnoteValue>
             {!!account ? <PendingRewards /> : 'locked' }  PHZT
          </FootnoteValue>
          </Footnote>
        </Card>
        </StyledCardWrapper>
        <Spacer />
        <StyledCardWrapper2>
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="TOKEN Price" />
                  {!!account ? <TokenPrice /> : <StyledPrice>$--.--</StyledPrice> }
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
        </Card>
        </StyledCardWrapper2>
      </Container>
       <Spacer/>
      <Container size = 'rsm'>
      <StyledCardWrapper>
      <BackgroundSquare/>
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Total PHZT Supply" />
                  <Value
                    value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'}
                  />
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
          <Footnote>
            New rewards per block
          <FootnoteValue>{currentReward ? getBalanceNumber(currentReward) : 'locked'} PHZT</FootnoteValue>
          </Footnote>
        </Card>
        </StyledCardWrapper>
        <Spacer />
        <StyledCardWrapper2>
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Total value staked" />
                  {!!account ? <TotalStaked /> : <StyledPrice>$--.--</StyledPrice> }
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
        </Card>
        </StyledCardWrapper2>
        </Container>
    </StyledWrapper>




  )
}

const BackgroundSquare = styled.div`
  position: absolute;
  z-index: 2;
  top: 72%;
  width: 150%;
  height: 100%;
  background-color: ${(props) => props.theme.color.grey[904]};
 
`

const Footnote = styled.div`
  z-index: 3;
  font-size: 15px;
  padding: 11px 20px;
  color: ${(props) => props.theme.color.grey[906]};
  border-top: solid 3px ${(props) => props.theme.color.grey[300]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`
const FootnoteValue = styled.div`
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
  'Lucida Sans', Arial, sans-serif;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
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
  width: calc((1000px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  height: 160px;
  position: relative;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
  @media (max-width: 500px) {
    width: 100%;
  }
`
const StyledCardWrapper2 = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  width: calc((1000px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  height: 120px;
  position: relative;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
  @media (max-width: 500px) {
    width: 100%;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`
const StyledPrice = styled.div`
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
  'Lucida Sans', Arial, sans-serif;
  color: ${(props) => props.theme.color.grey[910]};
  font-size: 36px;
  font-weight: 700;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  `

export default Balances
