import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Spacer from '../Spacer'

interface PageHeaderProps {
  icon: React.ReactNode
  icon2?: React.ReactNode
  subtitle?: string
  title?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, icon2, subtitle, title }) => {
  return (
    <Container size="md">
      <StyledPageHeader>
        <StyledIcon>
          <Spaner>{icon}</Spaner>
          <Spaner>{icon2}</Spaner>        
        </StyledIcon>
        <StyledTitle>{title}</StyledTitle>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </StyledPageHeader>
    </Container>
  )
}

const StyledPageHeader = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: ${(props) => props.theme.spacing[6]}px;
  padding-top: ${(props) => props.theme.spacing[6]}px;
  margin: 0 auto;
`

const Spaner = styled.span`
 float:right;
 margin-left:15px;
 margin-right:15px;
`
const StyledIcon = styled.div`
  font-size: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  width: 120px;
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.color.grey[906]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  
`

const StyledTitle = styled.h1`
  font-family: 'PT Sans', sans-serif;
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 50px;
  font-weight: 900;
  text-align: center;
  margin: 0;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${props => props.theme.color.grey[909]};
  font-size: 25px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`

export default PageHeader
