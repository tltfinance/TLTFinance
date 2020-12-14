import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import Spacer from '../../../components/Spacer'
import FRTLogo from '../../../assets/img/LogoFRT.png'

import {bonusFRTpercent} from '../../../pheezez/utils'
import { getFullDisplayBalance, getBalanceNumber, getDisplayBalance } from '../../../utils/formatBalance'
import Slider, { SliderTooltip, HandleProps, RangeProps, SliderProps } from 'rc-slider'
import 'rc-slider/assets/index.css'

interface DepositModalProps extends ModalProps {
  max: BigNumber
  maxFRT: BigNumber
  onConfirm: (amount: string, amountFRT: string) => void
  tokenName?: string
}



const DepositModal: React.FC<DepositModalProps> = ({
  max,
  maxFRT,
  onConfirm,
  onDismiss,
  tokenName = '',
}) => {

  
  const { createSliderWithTooltip } = Slider;
  const Range = createSliderWithTooltip(Slider.Range);
  const { Handle } = Slider;
  const [val, setVal] = useState('')
  const [valFRTLocal, setValFRTLocal] = useState(0)
  const [valFRT, setValFRT] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  
  

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const fullFRTBalance = useMemo(() => {
    return getFullDisplayBalance(maxFRT)
  }, [maxFRT])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSliderChange = useCallback(
    (e) => {
      if (e === maxFRT.toNumber()){
        setValFRT(fullFRTBalance)
        setValFRTLocal(maxFRT.toNumber())
      }
      else {
        setValFRT(getFullDisplayBalance(new BigNumber(e)))
        setValFRTLocal(e)
      }
      
     // console.log("SLIDERVAL", valFRT, maxFRT.toNumber(), e )
    },
    [setValFRT, setValFRTLocal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal>
      <ModalTitle text={`Deposit ${tokenName} Tokens`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
       <Spacer/>
      <StyledFRT>
      <div>
      {"Stake FRT for increased PHZT rewards "}
      {<img src={FRTLogo} style={{ height: 20 }} />}
      </div>
      <Spacer/>
      <div>
      {!valFRT ? 0 : getDisplayBalance(new BigNumber(valFRTLocal))}
      {" FRT"}
      </div>
      </StyledFRT>
      <Slider min={0} value={valFRTLocal} max={maxFRT.toNumber()} onChange={handleSliderChange} defaultValue={3} />
      <StyledFRT>
      <div>
      {"Bonus Percentage: "}
      </div>
      <Spacer/>
      <div>
      {bonusFRTpercent(valFRTLocal)}%
      </div>
      </StyledFRT>
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button 
          disabled={val === '0' || val === '' || val.includes('-') ? true : pendingTx}
          text={ pendingTx ? 'Pending Confirmation': 'Confirm'}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val, valFRT)
            setPendingTx(false)
            onDismiss()
          }}
        />
      </ModalActions>
    </Modal>
  )
}

const StyledFRT = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-around;
  font-size: 18px;
  color: ${(props) => props.theme.color.grey[906]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`
export default DepositModal
