import React from 'react'
import styled, { css, keyframes } from 'styled-components'

interface CardProps {
  children?: React.ReactNode,
  animation?: boolean
}

const Card: React.FC<CardProps> = ({ children, animation, }) => {
  return (
  <StyledCard animate={animation}>
       {children}
  </StyledCard>

  )
}

interface AnimatedCardProps {
  animate?: boolean,
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
  background: linear-gradient(45deg, ${(props) => props.theme.color.gradient[100]} 0%, ${(props) => props.theme.color.gradient[200]} 100%);
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
