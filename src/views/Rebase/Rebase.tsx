import React, { useEffect, useState, useCallback } from 'react'
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
import CannotRebaseModal from './components/CannotRebaseModal'
import NoNeedToRebaseModal from './components/NoNeedToRebaseModal'
import useModal from '../../hooks/useModal'
import { rebaseStartTime } from '../../pheezez/lib/constants'
import useRebase from '../../hooks/useRebase'
import useFRT from '../../hooks/useFRT'
import {
  RebaseListEntry,
  StyledProposalContentInner
} from './components/RebaseList'
import {
  rebase,
  getFRTDAIValue,
  getFRTDAIContract,
  formatTime,
  getFRtBalance,
  getNextHour,
  isRebasable
} from '../../pheezez/utilsFRT'
import Loader from '../../components/Loader'

const Rebase: React.FC = () => {
  const { account } = useWallet()
  const frt = useFRT()
  const frtdaiContract = getFRTDAIContract(frt)
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
  const [pendingTx, setPendingTx] = useState(false)
  const [frtdai, setFRTDAI] = useState(0)
  const { rebases } = useRebase()
  const [hasFRT, setHasFRT] = useState(0)
  const [startTime, setStartTime] = useState(818035920000)
  const [rebaseActive, setRebaseActive] = useState((Date.now() / 1000) % 3600 < 3 * 60)
  const [rebaseStart, setRebaseStart] = useState(rebaseStartTime * 1000 - Date.now() <= 0)
  const [onCannotRebase] = useModal(
    <CannotRebaseModal/>,
  )
  const [noNeedtoRebase] = useModal(
    <NoNeedToRebaseModal/>,
  )
 // let rebaseActive = (Date.now() / 1000) % 3600 < 3 * 60

  //console.log("EVENT", rebases)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function fetchFRT() {
      const balance = await getFRtBalance(frt, account)
      setHasFRT(balance)

    }
    if (frt) {
      fetchFRT()
    }
  }, [frt, setHasFRT])

  useEffect(() => {
    async function fetchFRTPrice() {
      const price = await getFRTDAIValue(frtdaiContract)
      setFRTDAI(price)
    }
    if (frtdaiContract) {
      fetchFRTPrice()
    }
  }, [frtdaiContract, setFRTDAI])

  useEffect(() => {
    if (!rebaseActive) {

      setStartTime(getNextHour(3600000))
    }
    else
    {
      setStartTime(getNextHour(180000))
    }

  }, [setStartTime, rebaseActive])


  const handleRebase = useCallback((frt, frtdaiContract, account) => {

    async function posibleToRebase() {
        const rebasable = await isRebasable(frt, frtdaiContract, account)
        //console.log("NOTICE", rebasable)
        
        if (rebasable === "yes")
        {

        
        setPendingTx(true)
        try {
  
          await rebase(frt, account)
        }
        catch (error) {
          console.log("EVENT", error)
        }
        //console.log("EVENT", pair)
        setPendingTx(false)
    
        }
        else if ( rebasable === "same")
        {
          onCannotRebase()
        }
        else if (rebasable === "period" || rebasable === "price")
        {
          noNeedtoRebase()
        }
        
    }
    
    if (frt && frtdaiContract && account) 
    {
      posibleToRebase()
    }
    
  }, [setPendingTx, frt, frtdaiContract, account ])


  const renderer = (countdownProps: CountdownRenderProps) => {
    const { minutes, seconds, completed } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    if (completed) {
      // Render a completed state
      return (
      <>
      {setRebaseActive((Date.now() / 1000) % 3600 < 3 * 60)}
      {setRebaseStart(rebaseStartTime * 1000 - Date.now() <= 0)}      
      </>
      )
    } else {
      return (
        <>


          <span style={{ width: '100%' }}>
            {paddedMinutes} Min {paddedSeconds} Sec
      </span>
        </>
      )
      }
  }


  return (
    <Page>
      {!!account ? (
        <>

          <PageHeader
            icon={<i className="fas fa-toilet-paper" />}
            title="Keep FRT value closer to 1 DAI and control the Total Supply!"
            subtitle="You can earn FRT for every rebase you trigger"
          />
          <Container>
            <Spacer size="md" />
            <Split>
              <StyledCardsWrapper>


                <StyledCardWrapper>
                  <Card>
                    <StyledContent>
                      <StyledTitle>
                        Current FRT to DAI Ratio:
                  </StyledTitle>
                      <Spacer></Spacer>
                      <Spacer></Spacer>
                      <StyledDetails>
                        <StyledDetail>
                          1 FRT = {(rebaseStart) ? numeral(frtdai).format('0,0.00') : "--.--"} DAI.
                    </StyledDetail>
                      </StyledDetails>
                    </StyledContent>
                  </Card>
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Card>
                    <StyledContent>
                      <StyledTitle>
                        Rebase:
                    </StyledTitle>
                      <StyledProposalButtonWrapper>
                        <Button
                          text="Rebase"
                          disabled={!rebaseStart || !rebaseActive || !frt || hasFRT <= 0 ? true : pendingTx}
                          onClick={async () => {

                            await handleRebase(frt, frtdaiContract, account)

                          }}
                          variant="tertiary"
                        />
                      </StyledProposalButtonWrapper>
                      <StyledTitle>
                       {
                       (!rebaseStart || !rebaseActive) && (<div>"Rebase is not active yet"</div>)
                       ||
                       (rebaseActive && rebaseStart) && (<Countdown
                            date={startTime}
                            renderer={renderer}
                          />)}
                    </StyledTitle>
                    </StyledContent>
                  </Card>
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Card>
                    <StyledContent>
                      <StyledTitle>
                        Next Rebase Window:
                  </StyledTitle>
                      <StyledDetails>
                        <StyledDetail>
                        {
                         (!rebaseStart) && (<div>--:--:--</div>)
                         ||
                        (!rebaseActive) &&
                          (<Countdown
                            date={startTime}
                            renderer={renderer}
                          />) ||
                          (rebaseActive) && "Time to Rebase!!" }
                        </StyledDetail>
                      </StyledDetails>
                      <StyledTitle>
                        Last Rebase:
                  </StyledTitle>
                      <StyledDetails>
                        <StyledDetail>
                          {(rebases && rebases.length > 0) && formatTime(rebases[0].date) || "No rebases"}
                        </StyledDetail>
                      </StyledDetails>
                    </StyledContent>
                  </Card>
                </StyledCardWrapper>
              </StyledCardsWrapper>
            </Split>
            <Spacer size="lg" />
            <StyledProposalsWrapper>
              <Card>
                <CardTitle text="List of Rebases - (Last 24)" />
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
                      <StyledDescriptionMain>Date</StyledDescriptionMain>
                      <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer1'} />
                      <StyledAddressMain>Address</StyledAddressMain>
                      <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer2'} />
                      <StyledStateMain>FRT earned</StyledStateMain>
                      <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer3'} />
                      <StyledButtonMain>Transaction</StyledButtonMain>
                    </StyledProposalContentInner>
                  </Box>
                  <Spacer size="sm" />
                  {(!rebases) &&
                    (
                      <StyledLoadingWrapper>
                      <Loader text="Loading Rebase List ..." />
                    </StyledLoadingWrapper>
                    )
                    ||
                    (rebases.length == 0) &&
                    (
                    <StyledLoadingWrapper>
                      There are no Rebases yet
                    </StyledLoadingWrapper>
                    )
                    ||
                    (rebases) &&
                    (

                      <StyledListWrapper>
                        <Scrollbars autoHide autoHeight
                          autoHeightMin={0}
                          autoHeightMax={405} style={{ width: "100%", borderRadius: "1rem" }}>
                          <Card variant='secondary'>
                            {
                              rebases.map((reb, i) => {
                                if (i === 0) {
                                  return <RebaseListEntry key={reb.hash} reb={reb} />
                                } else {
                                  return [<Separator />, <RebaseListEntry key={reb.hash} reb={reb} />]
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
  text-align: center;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`

export const StyledAddressMain = styled.span`
  font-weight: 600;
  font-size: 20px;
  display: grid;
  grid-area: who;
  text-align: center;
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
  width: 750px;
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
  height: 245px;
  @media (max-width: 700px) {
    width: 100%;
  }
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[1]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px #000000;
`
const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[910]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  font-size: 20px;
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

export default Rebase
