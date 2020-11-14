import React  from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        Home
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/farms">
        Farms
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/rebase">
        Rebase
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/gov">
        Governance
      </StyledLink>
      <StyledAbsoluteLink
        href="https://medium.com/@tltphzt/key-details-about-tlt-finance-and-pheezez-phzt-4eef3a6975fd"
        target="_blank"
      >
        About
      </StyledAbsoluteLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    display: none;
    }
`

const StyledLink = styled(NavLink)`
  color: white; 
  font-size: 1.2rem;
  font-family: 'Montserrat', sans-serif;
  padding: 0.5rem 1rem;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
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
  @media (max-width: 400px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`

const StyledAbsoluteLink = styled.a`
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    background-color: ${(props) => props.theme.color.grey[905]};
    border-radius: 4px;
    transition: all 0.2s ease-out;
  }
  &.active {
    color: ${(props) => props.theme.color.primary.main};
    transition: all 0.2s ease-out;
  }
  @media (max-width: 400px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`

export default Nav
