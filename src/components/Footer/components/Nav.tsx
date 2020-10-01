import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink
        target="_blank"
        href="https://rinkeby.etherscan.io/address/0x5e8e79b9dcbe024f69c6b6414338ffb05067524f"
      >
        Digester Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://rinkeby.etherscan.io/address/0x793D0F8944B05f7C91403CF8925BDbF695e06858#code"
      >
        Pheezez Contract
      </StyledLink>
      <StyledLink target="_blank" href="">
        Discord
      </StyledLink>
      <StyledLink target="_blank" href="">
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
