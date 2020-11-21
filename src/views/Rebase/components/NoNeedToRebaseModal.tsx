import React, { useCallback, useMemo, useState, useEffect } from 'react'
import CardContent from '../../../components/CardContent'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import styled from 'styled-components'


const NoNeedToRebaseModal: React.FC<ModalProps> = ({
  onDismiss,

}) => {

  return (
    <Modal>
      <ModalTitle text="No need to Rebase" />   
      <ModalActions>
        <Button
          onClick={onDismiss}
          text="Close"
          variant="tertiary"
        />
      </ModalActions>

    </Modal>
  )
}


const StyledTitle = styled.h1`
  color: ${props => props.theme.textColor};
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${props => props.theme.textColor};
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  opacity: 0.66;
  padding: 0;
`

const StyledLineHolder = styled.div`
  width: 80%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
`

const StyledDescription = styled.div`
  font-weight: 600;
  font-size: 20px;
`

const StyledInfo = styled.div`
  font-size: 14px;
`
export default NoNeedToRebaseModal
