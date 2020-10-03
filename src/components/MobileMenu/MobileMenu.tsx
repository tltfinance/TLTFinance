import React from 'react'
import styled, { keyframes } from 'styled-components'
import AccountButton from '../../components/TopBar/components/AccountButton'

import { NavLink } from 'react-router-dom'

interface MobileMenuProps {
  onDismiss: () => void
  visible?: boolean
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onDismiss, visible }) => {
  if (visible) {
    return (


      <StyledMobileMenuWrapper>
        <StyledBackdrop onClick={onDismiss} />
        <StyledMobileMenu>
          <StyledMenuButton onClick={onDismiss}>
            <i className="fas fa-times"></i>
          </StyledMenuButton>
          <StyledLink exact activeClassName="active" to="/" onClick={onDismiss}>
            Home
          </StyledLink>
          <StyledLink
            exact
            activeClassName="active"
            to="/farms"
            onClick={onDismiss}
          >
            Farms
          </StyledLink>
          <StyledLink
            exact
            activeClassName="active"
            to="/gov"
            onClick={onDismiss}
          >
            Governance
          </StyledLink>
          <StyledAbsoluteLink
            href="https://medium.com/@tltphzt/key-details-about-tlt-finance-and-pheezez-phzt-4eef3a6975fd"
            target="_blank"
          >
            About
      </StyledAbsoluteLink>
          <StyledAccountButtonWrapper onClick={onDismiss}>
            <AccountButton />
          </StyledAccountButtonWrapper>
        </StyledMobileMenu>
      </StyledMobileMenuWrapper>

    )
  }
  return null
}

const StyledAbsoluteLink = styled.a`
color: white; 
box-sizing: border-box;
font-size: 24px;
font-weight: 700;
padding: ${(props) => props.theme.spacing[3]}px
  ${(props) => props.theme.spacing[4]}px;
text-align: center;
text-decoration: none;
width: 100%;
&:hover {
  background-color: ${(props) => props.theme.color.grey[905]};
  border-radius: 4px;
  transition: all 0.2s ease-out;
}
&.active {
  color: ${(props) => props.theme.color.grey[906]};
  transition: all 0.2s ease-out;
  text-shadow: 2px 2px 4px #000000;
}
`


const StyledMenuButton = styled.button`
  background: none;
  border: 0;
  margin: 0;
  outline: 0;
  padding: 0;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 2rem;
    cursor: pointer;
    color: white; 
   `

const StyledAccountButtonWrapper = styled.div`
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  text-align: center;
  padding: ${(props) => props.theme.spacing[3]}px
    ${(props) => props.theme.spacing[4]}px;
`

const StyledBackdrop = styled.div`
  background-color: ${(props) => props.theme.color.grey[907]}aa;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const StyledMobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const slideIn = keyframes`
  0% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(-100%);
  }
`

const StyledMobileMenu = styled.div`
  animation: ${slideIn} 0.3s forwards ease-out;
  background-color: ${(props) => props.theme.color.grey[908]};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  width: calc(100% - 48px);
`

const StyledLink = styled(NavLink)`
  color: white; 
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 700;
  padding: ${(props) => props.theme.spacing[3]}px
    ${(props) => props.theme.spacing[4]}px;
  text-align: center;
  text-decoration: none;
  width: 100%;
  &:hover {
    background-color: ${(props) => props.theme.color.grey[905]};
    border-radius: 4px;
    transition: all 0.2s ease-out;
  }
  &.active {
    color: ${(props) => props.theme.color.grey[906]};
    transition: all 0.2s ease-out;
    text-shadow: 2px 2px 4px #000000;
  }
`

export default MobileMenu
