import React, {useContext} from 'react'
import styled, { css, keyframes, ThemeContext } from 'styled-components'

interface CardProps {
  children?: React.ReactNode,
  animation?: boolean,
  variant?: 'default' | 'secondary'
}

const Card: React.FC<CardProps> = ({ children, animation, variant }) => {
  const { color } = useContext(ThemeContext)
  let color1: string
  let color2: string
  switch (variant) {
    case 'secondary':
      color1 = color.gradient[300]
      color2 = color.gradient[400]
      break
    case 'default':
    default:
      color1 = color.gradient[100]
      color2 = color.gradient[200]
  }
  return (
  <StyledCard animate={animation} firstColor={color1} secondColor={color2}>
       {children}
  </StyledCard>

  )
}

interface AnimatedCardProps {
  animate?: boolean,
  firstColor: string,
  secondColor: string
}

const rotate = keyframes`
  
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }

`

const Still = keyframes`
`

const StyledCard = styled.div<AnimatedCardProps>`
  background: linear-gradient(45deg, ${(props) => props.firstColor} 0%, ${(props) => props.secondColor} 100%);
  background-size: ${props => props.animate ? css`100% 100%` : css`100% 100%`}; 
  border-radius: 1rem;
  padding: 1rem 0 2rem;
  color: white;
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  &::before{
    content: "";
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background: linear-gradient(-135deg, ${(props) => props.theme.color.gradient[100]} 0%, ${(props) => props.theme.color.gradient[200]} 100%);
    transition: opacity 0.75s;
    animation: ${props => props.animate ? css`${rotate} 900ms ease-in-out 0s infinite alternate-reverse` : css`${Still}`};
  }

`





export default Card
