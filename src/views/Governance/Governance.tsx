import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Scrollbars } from 'react-custom-scrollbars'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { useWallet } from 'use-wallet'
import numeral from 'numeral'
import Page from '../../components/Page'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Card from '../../components/Card'
import CardTitle from '../../components/CardTitle'
import CardContent from '../../components/CardContent'
import Spacer from '../../components/Spacer'
import Separator from '../../components/Separator'
import Split from '../../components/Split'
import Box from "./components/BoxWithDisplay"
import SeparatorGrid from "./components/SeparatorWithCSS"
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'
import useModal from '../../hooks/useModal'
import usePheezez from '../../hooks/usePheezez'
import { proposalStartTime } from '../../pheezez/lib/constants'
import useGovernance from '../../hooks/useGovernance'
import ProposalModal from './components/ProposalModal'
import {
  ProposalEntry,
  StyledDescription,
  StyledState,
  StyledButton,
  StyledProposalContentInner
} from './components/Proposal'
import Loader from '../../components/Loader'

const Governance: React.FC = () => {
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { proposals, onVote, onPropose, currentPower, onQueue, onExecute, onCancel } = useGovernance()
  const pheezez = usePheezez()
  const [startTime, setStartTime] = useState(proposalStartTime)
  const [onPresentProposal] = useModal(
    <ProposalModal
      onConfirm={onPropose} />,
  )


  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds, completed } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    const paddedDays = days < 10 ? `0${days}` : days
    if (completed) {
      return (
        <>
          <PageHeader
            icon={<i className="fas fa-toilet-paper" />}
            title="Create proposals, vote and grow the Community!"
          />
          <Container>
            <Spacer size="md" />
            <Split>
              <Spacer />
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Card>
                    <StyledContent>
                      <StyledTitle>
                        Create a Proposal:
                    </StyledTitle>
                      <StyledProposalButtonWrapper>
                        <Button
                          text="Propose"
                          onClick={onPresentProposal}
                          variant="tertiary"
                        />
                      </StyledProposalButtonWrapper>
                    </StyledContent>
                  </Card>
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Card>
                    <StyledContent>
                      <StyledTitle>
                        Your Voting Power:
                  </StyledTitle>
                      <StyledDetails>
                        <StyledDetail>
                          {numeral(currentPower).format('0a')} Votes.
                    </StyledDetail>
                      </StyledDetails>
                    </StyledContent>
                  </Card>
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer />
            </Split>
            <Spacer size="lg" />
            <StyledProposalsWrapper>
              <Card>
                <CardTitle text="On-chain Proposals" />
                <Spacer size="sm" />
                <CardContent>
                  <Box
                    display="grid"
                    alignItems="center"
                    paddingLeft={4}
                    paddingRight={4}
                    paddingBottom={1}
                    row
                  >
                    <StyledProposalContentInner>
                      <StyledDescriptionMain>Description</StyledDescriptionMain>
                      <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer1'} />
                      <StyledStateMain>State</StyledStateMain>
                      <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer2'} />
                      <StyledButtonMain>Action</StyledButtonMain>
                    </StyledProposalContentInner>
                  </Box>
                  <Spacer size="sm" />
                  {
                    (!proposals) &&
                    (
                      <StyledLoadingWrapper>
                      <Loader text="Loading Proposal List ..." />
                    </StyledLoadingWrapper>
                    )
                    ||
                    (proposals.length == 0) &&
                    (
                    <StyledLoadingWrapper>
                      There are no Proposals yet
                    </StyledLoadingWrapper>
                    )
                    ||
                    (proposals) &&
                    (

                      <StyledListWrapper>
                        <Scrollbars autoHide autoHeight
                          autoHeightMin={0}
                          autoHeightMax={405} style={{ width: "100%", borderRadius: "1rem" }}>
                          <Card variant='secondary'>
                            {
                              proposals.map((prop, i) => {
                                if (i === 0) {
                                  return <ProposalEntry key={prop.hash} prop={prop} onVote={onVote} onQueue={onQueue} onExecute={onExecute} onCancel={onCancel} />
                                } else {
                                  return [<Separator />, <ProposalEntry key={prop.hash} prop={prop} onVote={onVote} onQueue={onQueue} onExecute={onExecute} onCancel={onCancel} />]
                                }
                              })
                            }
                          </Card>
                        </Scrollbars>
                      </StyledListWrapper>


                    )
                  }
                </CardContent>
              </Card>
            </StyledProposalsWrapper>
          </Container>

        </>
      )
    }
    else {
      return (
        <>

          <StyledCounter>
            Proposals will be ready in
      <span style={{ width: '100%' }}>
              {paddedDays} Days {paddedHours} Hours {paddedMinutes} Minutes {paddedSeconds} Seconds
      </span>
          </StyledCounter>
        </>
      )
    }
  }


  return (
    <Page>
      {!!account ? (
        <>

          <Countdown
            date={startTime * 1000}
            renderer={renderer}
          />


        </>
      ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={onPresentWalletProviderModal}
              text="Unlock Wallet"
              variant='tertiary'
            />
          </div>
        )}
    </Page>
  )
}

export const StyledProposalsWrapper = styled.div`
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
  border-radius: 1rem;
`

export const StyledButtonMain = styled.div`
  font-weight: 600;
  font-size: 20px;
  display: grid;
  grid-area: vote;
  margin-left: 10px;
  justify-content: center;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`

export const StyledDescriptionMain = styled.span`
  font-weight: 600;
  font-size: 20px;
  display: grid;
  grid-area: desc;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`

export const StyledStateMain = styled.span`
  font-weight: 600;
  font-size: 20px;
  margin-left: 5px;
  margin-right: 5px;
  display: grid;
  grid-area: state;
  justify-content: center;
  min-width: 67px;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledProposalButtonWrapper = styled.div`
  margin-top: 40px;
  z-index: 3;
  @media (max-width: 500px) {
    justify-content: center;
    width: auto;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`
const StyledCounter = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  font-family: 'PT Sans', sans-serif;
  flex-direction: column;
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 50px;
  font-weight: 900;
  margin: 0;
  padding: 0;
`

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  border-radius: 1rem;
  flex-direction: column;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  height: 200px;
  @media (max-width: 700px) {
    width: 100%;
  }
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 3rem;
  text-shadow: 2px 2px 4px #000000;
`
const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[910]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  text-align: center;
  margin-top: 20px;

`
const StyledListWrapper = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  position: relative;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
 
`

export default Governance
