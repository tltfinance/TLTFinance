import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useTokenBalance from '../../../hooks/useTokenBalance'
import usePheezez from '../../../hooks/usePheezez'
import useFRT from '../../../hooks/useFRT'
import { getPheezezAddress } from '../../../pheezez/utils'
import { getFRTAddress } from '../../../pheezez/utilsFRT'
import { getBalanceNumber } from '../../../utils/formatBalance'
import Button from '../../Button'
import CardIcon from '../../CardIcon'
import Label from '../../Label'
import Modal, { ModalProps } from '../../Modal'
import ModalActions from '../../ModalActions'
import ModalContent from '../../ModalContent'
import ModalTitle from '../../ModalTitle'
import Spacer from '../../Spacer'
import Value from '../../Value'
import tlogo from '../../../assets/img/tokenLogo.svg'
import frtlogo from '../../../assets/img/LogoFRT.png'


const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, reset } = useWallet()

  const handleSignOutClick = useCallback(() => {
    onDismiss!()
    reset()
  }, [onDismiss, reset])

  const pheezez = usePheezez()
  const frt = useFRT()
  const pheezezBalance = useTokenBalance(getPheezezAddress(pheezez))
  const frtBalance = useTokenBalance(getFRTAddress(frt))
  //console.log("BALANCE", pheezezBalance)

  return (
    <Modal>
      <ModalTitle text="My Account" />
      <ModalContent>
        <Spacer />

        <div style={{ display: 'flex' }}>
          <StyledBalanceWrapper>
            <CardIcon>
            {<img src={tlogo} height={60} alt = "Logo" />}
            </CardIcon>
            <StyledBalance>
              <Value value={getBalanceNumber(pheezezBalance)} />
              <Label text="PHZT Balance" />
            </StyledBalance>
          </StyledBalanceWrapper>
          <StyledBalanceWrapper>
            <CardIcon>
            {<img src={frtlogo} height={50} alt = "Logo" />}
            </CardIcon>
            <StyledBalance>
              <Value value={getBalanceNumber(frtBalance)} />
              <Label text="FRT Balance" />
            </StyledBalance>
          </StyledBalanceWrapper>
        </div>

        <Spacer />
        <Button
          href={`https://etherscan.io/address/${account}`}
          text="View on Etherscan"
          variant="secondary"
        />
        <Spacer />
        <Button
          onClick={handleSignOutClick}
          text="Sign out"
          variant="secondary"
        />
      </ModalContent>
      <ModalActions>
        <Button onClick={onDismiss} text="Cancel" />
      </ModalActions>
    </Modal>
  )
}

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

export default AccountModal
