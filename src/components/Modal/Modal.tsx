import React, {useContext} from 'react'
import styled, { keyframes, ThemeContext } from 'styled-components'
import ReactDOM from "react-dom"

export interface ModalProps {
  onDismiss?: () => void,
  size?: 'large' | 'normal'
}

const Modal: React.FC<ModalProps> = ({ children, size }) => {
  const { breakpoints } = useContext(ThemeContext)
  let size1: string
  let size2: string
  switch (size) {
    case 'large':
      size1 = breakpoints.smallScreen
      size2 = breakpoints.mobile
      break
    case 'normal':
    default:
      size1 = breakpoints.mobile
      size2 = breakpoints.mobile
  }
  return ReactDOM
    .createPortal(
      <StyledResponsiveWrapper big={size1} regular={size2}>
        <StyledModal>{children}</StyledModal>
      </StyledResponsiveWrapper>,
      document.querySelector("#modal")
    );
}

interface ModalVariantProps {
  big: string,
  regular: string
}

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`

const StyledResponsiveWrapper = styled.div<ModalVariantProps>`
  z-index: 3;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: fixed;
  width: 100%;
  max-width: 512px;
  @media screen and (max-height: ${(props) => props.big}px) {
    flex: 1;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    align-items: center;
    max-height: calc(100% - ${(props) => props.theme.spacing[1]}px);
  }
  @media (max-width: ${(props) => props.regular}px) {
    flex: 1;
    position: fixed;
    top: 100%;
    right: 0;
    left: 0;
    max-height: calc(100% - ${(props) => props.theme.spacing[4]}px);
    animation: ${mobileKeyframes} 0.3s forwards ease-out;
  }

`

const StyledModal = styled.div`
  padding: 0 20px;
  background: ${(props) => props.theme.color.grey[200]};
  border: 1px solid ${(props) => props.theme.color.grey[300]}ff;
  border-radius: 12px;
  box-shadow: inset 2px 2px 0px ${(props) => props.theme.color.grey[100]};
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: 0;
`

const StyledModalContent = styled.div``

export default Modal
