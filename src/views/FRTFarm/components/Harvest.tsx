import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useFRTEarnings'
import useReward from '../../../hooks/useFRTReward'
import { getBalanceNumber } from '../../../utils/formatBalance'
import tlogo from '../../../assets/img/tokenLogo.svg'

interface HarvestProps {
  pid: number
}

const Harvest: React.FC<HarvestProps> = ({ pid }) => {
  const earnings = useEarnings(pid)
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useReward(pid)

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
            {<img src={tlogo} height={60} alt = "Logo" />}
            </CardIcon>
            <Value value={getBalanceNumber(earnings)} />
            <Label text="FRT Earned" />
          </StyledCardHeader>
          <StyledCardActions>
          <StyledButtonWrapper>
            <Button
              disabled={!earnings.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting FRT' : 'Withdraw'}
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

export default Harvest