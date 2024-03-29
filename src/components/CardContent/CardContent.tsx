import React from 'react'
import styled from 'styled-components'

const CardContent: React.FC = ({ children }) => (

  <StyledCardContent>
    {children}
  </StyledCardContent>
)

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  opacity: 1;
  z-index: 2;
  position: relative;
  padding: ${(props) => props.theme.spacing[3]}px;
`


export default CardContent
