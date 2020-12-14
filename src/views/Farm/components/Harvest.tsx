import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import Spacer from '../../../components/Spacer'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import useBonusStart from '../../../hooks/useBonusStart'
import { getBalanceNumber } from '../../../utils/formatBalance'
import tlogo from '../../../assets/img/tokenLogo.svg'
import Container from '../../../components/Container'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { getBonusPercent, excludeFRTBonus } from '../../../pheezez/utils'
import BigNumber from 'bignumber.js'



interface HarvestProps {
  pid: number
}

const Harvest: React.FC<HarvestProps> = ({ pid }) => {
  const { account } = useWallet()
  const earnings = useEarnings(pid)
  const bonusDate = useBonusStart(pid)
  const [pendingTx, setPendingTx] = useState(false)
  const [bonusPercent, setbonusPercent] = useState(0)
  const { onReward } = useReward(pid)
  console.log("BONUS DATE", bonusDate.toNumber())

  useEffect(() => {
    async function fetchFRT() {
      const balance = await getBonusPercent(pid, account)
      setbonusPercent(balance)

    }
    if (account) {
      fetchFRT()
    }
  }, [account, setbonusPercent])


  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds, completed } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    const paddedDays = days < 10 ? `0${days}` : days
    if (completed) {
      // Render a completed state
      return (
        <>
        <Value value={getBalanceNumber(excludeFRTBonus(earnings, bonusPercent, 0))} />
        <Label text="Bonus PHZT rewards" />
        </>
      )
    } else {
      return (
        <>
          <div>
          Bonus Rewards Start in:
          </div>
          <span style={{ width: '100%' }}>
          {paddedDays} days {paddedHours} Hrs {paddedMinutes} Min {paddedSeconds} Sec
      </span>
        </>
      )
    }
  }

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              {<img src={tlogo} height={60} alt="Logo" />}
            </CardIcon>
            <Value value={getBalanceNumber(excludeFRTBonus(earnings, bonusPercent, 1))} />
            <Label text="PHZT Earned" />
            <Spacer />
            <StyledTitle>
            {bonusDate.toNumber() > 0 && (<Countdown
              date={bonusDate.toNumber() * 1000}
              renderer={renderer}
            />)}
            </StyledTitle>
          </StyledCardHeader>
          <StyledCardActions>
            <StyledButtonWrapper>
              <Button
                disabled={!earnings.toNumber() || pendingTx}
                text={pendingTx ? 'Collecting PHZT' : 'Withdraw'}
                onClick={async () => {
                  setPendingTx(true)
                  await onReward()
                  setPendingTx(false)
                }}
              />
            </StyledButtonWrapper>
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}
const StyledButtonWrapper = styled.div`
  z-index: 3;
  width:50%;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[910]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  font-size: 20px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  text-align: center;
  margin-top: 20px;

`

export default Harvest
