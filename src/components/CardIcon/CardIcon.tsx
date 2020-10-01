import React, { useContext } from 'react'
import styled, { ThemeContext }from 'styled-components'

interface CardIconProps {
  children?: React.ReactNode,
  size?: 'sm' | 'md'
}

const CardIcon: React.FC<CardIconProps> = ({ children, size, }) => {

  const { width } = useContext(ThemeContext)
  let iconwidth: number
  
  switch (size) {
    case 'md':
      iconwidth = width[1]
       break
      case 'sm':
    default:
      iconwidth = width[2]
  }
  //console.log("WIDTH", iconwidth)
  return (
  <StyledCardIcon width={iconwidth} >
    {children}
  </StyledCardIcon>
  )
}

interface StyledCardIconProps {
  width: number
}

const StyledCardIcon = styled.div<StyledCardIconProps>`
  background: linear-gradient(45deg, ${props => props.theme.color.gradient[200]} 0%, ${props => props.theme.color.gradient[100]} 100%);
  font-size: 36px;
  color: white;
  height: 80px;
  width: ${props => props.width}px;
  border-radius: 25%;
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  box-shadow: 0px 11px 15px -7px ${props => props.theme.color.grey[900]};
  margin: 0 auto ${props => props.theme.spacing[3]}px;
`

export default CardIcon