import React from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/logo.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'



const Home: React.FC = () => {
  return (


    <Page>
      <PageHeader
        icon={<i className="fas fa-toilet-paper" />}
        title="What goes in, must go out"
        subtitle="Digest your food Uniswap LP tokens and produce PHZT!"
      />
      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
      <StyledInfo>
        <b>PHZT-ETH LP has a higher yield and nets more rewards.</b>
      </StyledInfo>
      <Spacer size="lg" />
      <div
        style={{
          margin: '0 auto',
        }}
      >

      </div>
    </Page>

  )
}

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[909]};
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
`

export default Home
