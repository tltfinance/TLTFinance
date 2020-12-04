import BigNumber from 'bignumber.js'
import React, { useEffect, useState, useRef } from 'react'
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
import useFRTAllStakedValue from '../../../hooks/useFRTAllStakedValue'
import useFRTAllEarnings from '../../../hooks/useFRTAllEarnings'
import useTokenBalance from '../../../hooks/useTokenBalance'
import usePheezez from '../../../hooks/usePheezez'
import pheezezLogo from '../../../assets/img/tokenLogo.svg'
import FRTLogo from '../../../assets/img/LogoFRT.png'
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
import useFRT from '../../../hooks/useFRT'
import {
  getFRTAddress,
  getFRTSupply,
  getCurrentFRTPerBlock,
  getPoolContract,
  getFRTDAIContract,
  getFRTDAIValue,
  getPools
} from '../../../pheezez/utilsFRT'
import { getBalanceNumber, getBalanceNumbernoDec, getDisplayBalance } from '../../../utils/formatBalance'
import Container from '../../../components/Container'
import { frtFarmStartTime, rebaseStartTime } from '../../../pheezez/lib/constants'


let ethUsd = 0
let tokenUsd = 0
let tokenDai = 0



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
    <>
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
    <Spacer size = 'sm'/>
    </>
  )
}

const PendingFRTRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allFRTEarnings = useFRTAllEarnings()
  let sumEarning = 0
  for (let earning of allFRTEarnings) {
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

const FRTPrice: React.FC = () => {
  const [start, setStart] = useState(0)
  const frt = useFRT()
  const frtdaiContract = getFRTDAIContract(frt)
  const [frtdai, setFRTDAI] = useState(0)
  

  useEffect(() => {
    async function fetchFRTPrice() {
      const price = await getFRTDAIValue(frtdaiContract)
      setFRTDAI(price)
    }
    if (frtdaiContract) {
      fetchFRTPrice()
    }
  }, [frtdaiContract, setFRTDAI])

  tokenDai = frtdai
  return (
    <StyledPrice>
      $
      <CountUp
        start={start}
        end={frtdai}
        decimals={frtdai < 0 ? 4 : frtdai > 1e5 ? 0 : 4}
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
  const [stakedValue, setStakedValue] = useState(0)


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
  let staked = 0
  /////Logic for calculating the price of the total LP tokens staked in the pool***///////////////////
  if (allStakedValue && allStakedValue.length) {
    allStakedValue.forEach((element, index) => {
      // console.log(`Current index: ${index}`);
      // console.log(element.wethAmount.toNumber(), element..toNumber());
      if (element.tokenPriceInWeth.toNumber() === 0 && element.pheezezAmount.toNumber() > 0) {
        sumToken += element.pheezezAmount.times(tokenUsd).toNumber()  //To find the value of tokens that do not have an Ether pair in their LP. (PHEEZEZ)
        // console.log("TEST%%%", sumToken, tokenUsd)
      }
      else {
        sumWeth += element.wethAmount.toNumber()
      }
    });
    sumToken = sumToken * 2
    sumTokenEth = (sumWeth * ethUsd) * 2
    staked = sumToken + sumTokenEth

  }
  useEffect(() => {
    setStart(stakedValue)
    setStakedValue(staked)
  }, [staked])

  //console.log("ASTAKED VALUE", stakedValue, tokenUsd, sumTokenEth)
  //Check how to fix the countup refresh, weird.
  return (
    <StyledPrice>
      ${stakedValue === 0 ? stakedValue.toFixed(2) :
        <CountUp
          start={start}
          end={stakedValue}
          decimals={stakedValue < 0 ? 4 : stakedValue > 1e5 ? 0 : 4}
          duration={1}
          separator=","
        />}
        
    </StyledPrice>
  )
}

const TotaStakedinFRT: React.FC = () => {
  const [start, setStart] = useState(0)
  const frt = useFRT()
  const pheezez = usePheezez()
  const ehtusdContract = getethusdContract(pheezez)
  const [ethUsd, setEthUsd] = useState(0)
  const [stakedValue, setStakedValue] = useState(0)


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
  const allStakedValue = useFRTAllStakedValue()
  let sumTokenEth = 0
  let sumToken = 0
  let sumWeth = 0
  let staked = 0
  /////Logic for calculating the price of the total LP tokens staked in the pool***///////////////////
  if (allStakedValue && allStakedValue.length) {
    allStakedValue.forEach((element, index) => {
        (element.tokenPRiceinEther.toNumber() === 0 && element.tokenAmount.toNumber() > 0) || element.tokenPRiceinEther.isNaN() ? sumToken += element.tokenAmount.times(tokenUsd).toNumber() 
      : element.tokenPRiceinEther.toNumber() === 0 && element.frtAmount.toNumber() > 0 ? sumToken += element.frtAmount.times(tokenDai).toNumber()
      : sumWeth += element.wethAmount.toNumber()
        
      console.log("ASTAKED VALUE", element.tokenLPAmount.toNumber(), element.frtAmount.toNumber(), element.tokenAmount.toNumber(), element.tokenPRiceinEther.toNumber(), element.frtAmount.toNumber() , tokenUsd, sumToken, sumTokenEth, sumWeth)

    });
    sumToken = sumToken * 2
    sumTokenEth = (sumWeth * ethUsd) * 2
    staked = sumToken + sumTokenEth

  }
  useEffect(() => {
    setStart(stakedValue)
    setStakedValue(staked)
  }, [staked])

  //Check how to fix the countup refresh, weird.
  return (
    <StyledPrice>
      ${stakedValue === 0 ? stakedValue.toFixed(2) :
        <CountUp
          start={start}
          end={stakedValue}
          decimals={stakedValue < 0 ? 4 : stakedValue > 1e5 ? 0 : 4}
          duration={1}
          separator=","
        />}
    </StyledPrice>
  )
}

const Balances: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [totalFRTSupply, setTotalFRTSupply] = useState<BigNumber>()
  const [currentReward, setCurrentReward] = useState<BigNumber>()
  const [currentFRTReward, setCurrentFRTReward] = useState<BigNumber>()
  const pheezez = usePheezez()
  const frt = useFRT()
  const pools = getPools(frt)
  const pheezezBalance = useTokenBalance(getPheezezAddress(pheezez))
  const frtBalance = useTokenBalance(getFRTAddress(frt))
  const digesterContract = getDigesterContract(pheezez)
  const contract = getPoolContract(frt,0) //This is only used as a UseEffect dependency
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()
  const [farmStart, setFarmStart] = useState(frtFarmStartTime * 1000 - Date.now() <= 0)
  const [rebaseStart, setRebaseStart] = useState(rebaseStartTime * 1000 - Date.now() <= 0)
  const contracts : Array<any> = []

  useEffect(() => {
  let i = 0
  for (i; i < pools.length; i++)
  {
     contracts.push(getPoolContract(frt,i))
   
 }
 //This line is essential to avoid infinite loops on useEffect when having a dependency array.
// const {current:poolContract} = useRef(contracts)
}, [contract, frt])
 
 //console.log("Pool",  contract, contracts)


  useEffect(() => {
    async function fetchCurrentTokensPerBlock() {
      let reward = new BigNumber(0)
      let rrate = 0
      let sum = 0
      let rewardArray: Array<number> = []
      for (let i=0; i < pools.length - 1; i++) //Modify HERE for next pools. i < pools.length
      {
        reward = await getCurrentFRTPerBlock(frt, contracts[i])
        //console.log("rewardssss11111111111",reward.toNumber())
        rrate = reward.multipliedBy(new BigNumber(13)).dividedBy(new BigNumber(10).pow(18)).toNumber()
        rewardArray.push(rrate)
        //console.log('REWARDS', rrate )
      }
      sum = rewardArray.reduce((a, b) => a + b, 0)
      
      setCurrentFRTReward(new BigNumber(sum))
    }
    if (contracts) {
      fetchCurrentTokensPerBlock()
    }
  }, [contract, setCurrentFRTReward, frt])


  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getPheezezSupply(pheezez)
      const supplyFRT = await getFRTSupply(frt)
      setTotalSupply(supply)
      setTotalFRTSupply(supplyFRT)
    }
    if (pheezez && frt) {
      fetchTotalSupply()
    }
  }, [pheezez, frt, setTotalSupply, setTotalFRTSupply])

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
      <Container size='rsm'>
        <StyledCardWrapper>
          <BackgroundSquare />
          <Card>
            <CardContent>
              <StyledTitle>
                Balances
              </StyledTitle>
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
                <Spacer />
                <StyledBalance>
                  <Spacer />
                  <div style={{ flex: 1 }}>
                    <Label text="Your FRT Balance" />
                    <Value
                      value={!!account ? getBalanceNumber(frtBalance) : 'Locked'}
                    />
                  </div>
                </StyledBalance>

              </StyledBalances>
            </CardContent>
            <Footnote>
              Pending rewards
            <div>
          <FootnoteValueRight>
            <Spacer/>
                {!!account ? <PendingRewards /> : '--.--'}  PHZT {<img src={pheezezLogo} style={{ height: 20 }} />}
          </FootnoteValueRight>
          <FootnoteValueRight>
             <Spacer />
                {!!account && farmStart? <PendingFRTRewards /> : '--.--'} {' FRT'} {<img src={FRTLogo} style={{ height: 20 }} />}
          </FootnoteValueRight>
          </div>
            </Footnote>
          </Card>
        </StyledCardWrapper>
        <Spacer />
        <StyledCardWrapper2>
          <Card>
            <CardContent>
            <StyledTitle>
                Token Price
              </StyledTitle>
              <StyledBalances>
                <StyledBalance>
                  <Spacer />
                  <div style={{ flex: 1 }}>
                    <Label text="PHZT" />
                    {!!account ? <TokenPrice /> : <StyledPrice>$--.--</StyledPrice>}
                  </div>
                </StyledBalance>
             
                <StyledBalance>
                  <Spacer />
                  <div style={{ flex: 1 }}>
                    <Label text="FRT" />
                    {!!account && rebaseStart? <FRTPrice /> : <StyledPrice>$--.--</StyledPrice>}
                  </div>
                </StyledBalance>
              </StyledBalances>
            </CardContent>
          </Card>
        </StyledCardWrapper2>
      </Container>
      <Spacer />
      <Container size='rsm'>
        <StyledCardWrapper>
          <BackgroundSquare />
          <Card>
            <CardContent>
            <StyledTitle>
                Total Supply
              </StyledTitle>
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
                <Spacer />
                <StyledBalance>
                  <Spacer />
                  <div style={{ flex: 1 }}>
                    <Label text="Total FRT Supply" />
                    <Value
                      value={totalFRTSupply ? getBalanceNumber(totalFRTSupply) : 'Locked'} decimals = {0}
                    />
                  </div>
                </StyledBalance>
              </StyledBalances>
            </CardContent>
            <Footnote>
              New rewards per block
              <div>
          <FootnoteValueRight>
          <Spacer />
            {currentReward ? getBalanceNumber(currentReward) : '--.--'} PHZT  {<img src={pheezezLogo} style={{ height: 20 }} />}
            </FootnoteValueRight>
          <FootnoteValueRight>
          <Spacer />
            {!!account && currentFRTReward && farmStart  ? getBalanceNumbernoDec(currentFRTReward) : '--.--'} FRT {<img src={FRTLogo} style={{ height: 20 }} />}
            </FootnoteValueRight>
              </div>
            </Footnote>
          </Card>
        </StyledCardWrapper>
        <Spacer />
        <StyledCardWrapper2>
          <Card>
            <CardContent>
            <StyledTitle>
                Total Value Staked
              </StyledTitle>
              <StyledBalances>
                <StyledBalance>
                  <Spacer />
                  <div style={{ flex: 1 }}>
                    <Label text="PHZT Farms" />
                    {!!account ? <TotalStaked /> : <StyledPrice>$--.--</StyledPrice>}
                  </div>
                </StyledBalance>
                <StyledBalance>
                  <Spacer />
                  <div style={{ flex: 1 }}>
                    <Label text="FRT Farms" />
                    {!!account && farmStart ? <TotaStakedinFRT /> : <StyledPrice>$--.--</StyledPrice>}
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
  top: 70%;
  width: 150%;
  height: 100%;
  background-color: ${(props) => props.theme.color.grey[904]};
 
`

const Footnote = styled.div`
  z-index: 3;
  font-size: 20px;
  padding: 11px 20px;
  color: ${(props) => props.theme.color.grey[906]};
  border-top: solid 3px ${(props) => props.theme.color.grey[300]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`
const FootnoteValueRight = styled.div`
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
  'Lucida Sans', Arial, sans-serif;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 15px;

`
const FootnoteValueLeft = styled.div`
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
  'Lucida Sans', Arial, sans-serif;
  float: left;
  font-size: 15px;

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
  height: 340px;
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
  height: 230px;
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
  flex-direction: column;
`

const StyledSpan = styled.span`
color: ${(props) => props.theme.color.grey[906]};
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  border-top: solid 3px ${(props) => props.theme.color.grey[300]};

`
const StyledPrice = styled.div`
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
  'Lucida Sans', Arial, sans-serif;
  color: ${(props) => props.theme.color.grey[910]};
  font-size: 25px;
  font-weight: 700;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  `

const StyledTitle = styled.div`
  color: ${(props) => props.theme.color.grey[910]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  font-size: 30px;
  font-weight: 700;
  
  

`

export default Balances
