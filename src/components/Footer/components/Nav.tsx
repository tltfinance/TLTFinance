import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0xf16160dbeade7827058d3dbc9d5628ac930f7555#code"
      >
        Digester Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x8296bced40ba067a1de30aeb5a294258c16a0473#code"
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
