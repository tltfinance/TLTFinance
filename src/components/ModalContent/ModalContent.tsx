import React, {useContext} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {ModalProps} from '../Modal'

const ModalContent: React.FC<ModalProps> = ({ children, size }) => {
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
  return <StyledModalContent big={size1} regular={size2}>{children}</StyledModalContent>
}

interface ModalVariantProps {
  big: string,
  regular: string
}

const StyledModalContent = styled.div<ModalVariantProps>`
  padding: ${(props) => props.theme.spacing[4]}px;
  @media (max-width: ${(props) => props.regular}px) {
    flex: 1;
    overflow: auto;
  }
  @media screen and (max-height: ${(props) => props.big}px) {
    flex: 1;
    overflow: auto;
  }
`

export default ModalContent
