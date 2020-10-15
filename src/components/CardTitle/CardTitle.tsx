import React from 'react'
import styled from 'styled-components'

interface CardTitleProps {
  text?: string
}

const CardTitle: React.FC<CardTitleProps> = ({ text }) => (
  <StyledCardTitle>{text}</StyledCardTitle>
)

const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 23px;
  font-weight: 700;
  text-shadow: 2px 2px 4px #000000;
  padding: ${(props) => props.theme.spacing[4]}px;
  text-align: center;
`

export default CardTitle
