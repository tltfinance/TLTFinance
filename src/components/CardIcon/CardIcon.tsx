import React, { useContext } from 'react'
import styled, { ThemeContext }from 'styled-components'

interface CardIconProps {
  children?: React.ReactNode,
  label?: string
  size?: 'sm' | 'md'
  variant?: 'default' | 'secondary'
}

const CardIcon: React.FC<CardIconProps> = ({ children, label, size, variant }) => {

  const { width, color } = useContext(ThemeContext)
  let iconwidth: number
  let color1: string
  let color2: string
  switch (variant) {
    case 'secondary':
      color1 = color.gradient[100]
      color2 = color.gradient[200]
      break
    case 'default':
    default:
    
      color1 = color.gradient[300]
      color2 = color.gradient[400]
  }
  
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
  <StyledCardIcon width={iconwidth} firstColor={color1} secondColor={color2} >
  <Multiplier>{label}</Multiplier>
    {children}
  </StyledCardIcon>
  )
}

interface StyledCardIconProps {
  width: number,
  firstColor: string,
  secondColor: string
}

const Multiplier = styled.span`
background: linear-gradient(45deg, ${props => props.theme.color.gradient[200]} 0%, ${props => props.theme.color.gradient[100]} 100%);
border-radius: 15%;
color: white;
position: absolute;
right: 60px;
top: 10px;
font-size: 18px;
width: 35px;
text-align: center;
`
const StyledCardIcon = styled.div<StyledCardIconProps>`
  background: linear-gradient(45deg, ${(props) => props.firstColor} 0%, ${(props) => props.secondColor} 100%);
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