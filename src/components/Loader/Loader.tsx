import React from 'react'
import styled, { keyframes } from 'styled-components'
import logo from '../../assets/img/logo.png'

import CardIcon from '../CardIcon'

interface LoaderProps {
  text?: string
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <StyledLoader>
      <CardIcon>
        <StyledPheezez>{<img src={logo} height={60} />}</StyledPheezez>
      </CardIcon>
      {!!text && <StyledText>{text}</StyledText>}
    </StyledLoader>
  )
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const StyledLoader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledPheezez = styled.div`
  font-size: 32px;
  position: relative;
  animation: 1s ${spin} infinite;
`

const StyledText = styled.div`
  color: ${(props) => props.theme.color.grey[400]};
`

export default Loader