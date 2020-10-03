import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x7757a0085817cb6bfd9efdc4f43f49e22ae3be75#code"
      >
        Digester Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x15793315642e91479ce0d5c0e9d2cc6a79dbc1b0#code"
      >
        Pheezez Contract
      </StyledLink>
      <StyledLink target="_blank" href="https://discord.gg/2gqv8RB">
        Discord
      </StyledLink>
      <StyledLink target="_blank" href="https://twitter.com/FinanceTlt">
        Twitter
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 1.2rem;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[906]};
  }
`

export default Nav
