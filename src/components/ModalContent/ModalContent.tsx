import React from 'react'
import styled from 'styled-components'

const ModalContent: React.FC = ({ children }) => {
  return <StyledModalContent>{children}</StyledModalContent>
}

const StyledModalContent = styled.div`
  padding: ${(props) => props.theme.spacing[4]}px;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    flex: 1;
    overflow: auto;
  }
  @media screen and (max-height: ${(props) => props.theme.breakpoints.smallScreen}px) {
    flex: 1;
    overflow: auto;
  }
`

export default ModalContent
