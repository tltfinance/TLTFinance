import React, { useCallback, useMemo, useState, useEffect } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { Scrollbars } from 'react-custom-scrollbars'
import { Line } from 'rc-progress';
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Button from '../../../components/Button'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import Spacer from '../../../components/Spacer'
import Separator from '../../../components/Separator'
import styled from 'styled-components'
import usePheezez from '../../../hooks/usePheezez'
import useGovernance from '../../../hooks/useGovernance'
import { useWallet } from 'use-wallet'
import { Proposal } from "../../../contexts/Governance/types"
import Split from '../../../components/Split'
import {latestProposal, proposalEnd} from '../../../pheezez/utils'

interface VoteModalProps extends ModalProps {
  prop: Proposal,
  onVote: (proposal: number, side: boolean) => void,
  onQueue: (proposal: number) => void,
  onExecute: (proposal: number) => void,
  onCancel: (proposal: number) => void,
}

const VoteModal: React.FC<VoteModalProps> = ({
  prop,
  onDismiss,
  onVote,
  onQueue,
  onExecute,
  onCancel,
}) => {

  const { isVoting, votingPowers, currentPower, confirmTxModalIsOpen } = useGovernance();
  const { account } = useWallet()
  const pheezez = usePheezez()
  const [priorProposal, setPriorProposal] = useState(0)
  const [percFor, setpercFor] = useState(0)
  const [percAgainst, setpercAgainst] = useState(0)
  const [propEndtime, setpropEndtime] = useState(0)
  

  const handleVoteClickTrue = useCallback(async () => {
    await onVote(prop.id, true)
  }, [onVote])

  const handleVoteClickFalse = useCallback(async () => {
    onVote(prop.id, false)
  }, [onVote])

  const handleQueue = useCallback(async () => {
    await onQueue(prop.id)
    onDismiss()
  }, [onQueue])

  const handleExecute = useCallback(async () => {
    onExecute(prop.id)
  }, [onExecute])

  const handleCancel = useCallback(async () => {
    onCancel(prop.id)
  }, [onCancel])


  useEffect(() => {
    async function fetchPriorProposal() {
      const propos = await latestProposal(pheezez, account )
      setPriorProposal(propos)
    }
    if (pheezez) {
      fetchPriorProposal()
    }
  }, [pheezez, setPriorProposal])

  useEffect(() => {
    async function fetchProposalEndTime() {
      const endTime = await proposalEnd(prop.end)
      setpropEndtime(endTime)
    }
    if (pheezez) {
      fetchProposalEndTime()
    }
  }, [pheezez, setpropEndtime])

  useEffect(() => {
  if (prop.forVotes || prop.againstVotes != 0)
  {
  setpercFor(prop.forVotes / (prop.forVotes + prop.againstVotes) * 100)
  setpercAgainst(prop.againstVotes / (prop.forVotes + prop.againstVotes) * 100)
  }
  }, [setpercFor, setpercAgainst, prop.forVotes, prop.againstVotes ])

  //console.log("VOTES", percFor, percAgainst)

  let votePower;
  let voted;
  let side;
  if (votingPowers) {
    for (let i = 0; i < votingPowers.length; i++) {
       if (prop.hash == votingPowers[i].hash) {
         let votingPower = votingPowers[i];
         votePower = votingPower.power;
         voted = votingPower.voted;
         side = votingPower.side;
       }
    }
  }

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds, completed } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    const paddedDays = days < 10 ? `0${days}` : days
    return (
      <>
      <StyledCounter>
      {(prop.state === "Queued" ? "Remaining Queue Time" : "Voting Period ends in")}
      </StyledCounter>
      <StyledCounter>
        {paddedDays} Days {paddedHours} Hours {paddedMinutes} Minutes {paddedSeconds} Seconds
      </StyledCounter>
      </>
    )
  }

  return (
    <Modal size = "large">
      <ModalTitle text="Proposal Overview" />
      {
          (prop.state === "Queued") && (prop.eta * 1000 > Date.now()) && (
          <>
            {console.log(prop.eta, Date.now())}
            <Countdown
            date={prop.eta * 1000}
            renderer={renderer}
          />
           </>

          )
          ||
          (prop.state === "Active") && (
            <>
              {console.log(propEndtime, Date.now())}
              <Countdown
              date={Date.now()+ propEndtime* 1000}
              renderer={renderer}
            />
             </>
  
            )
        }
    
      <ModalContent size = "large">
        <div>
        { (voted) && (
          <>
          <StyledTitle>
            Your vote:
            
          </StyledTitle>
          <Spacer size="sm" />
          <StyledSubtitle>{side ? '"For"' : '"Against"'} with {numeral(votePower).format('0a')} votes.</StyledSubtitle>
          </>
        ) || (
          <>
          <StyledTitle>
            Your vote:
            <Spacer size="sm" />
          </StyledTitle>
          <StyledSubtitle>No vote</StyledSubtitle>
          </>
        )}
        </div>
        <Spacer size="sm"/>
        <Split>
          <CardContent>
            <Button
              size="sm"
              href={"https://etherscan.io/tx/" + prop.hash}
              text="View On Etherscan"
              variant="tertiary"
             />
          </CardContent>
          </Split>
          <StyledCardWrapper>
          <Card variant= 'secondary'>
            <CardContent>
            <StyledTitle>
              Votes
            </StyledTitle>
              <Separator />
              <Spacer size="sm" />
              <StyledLineHolder>
                For: {numeral(prop.forVotes).format('0.a')}
                <Line percent={percFor} strokeWidth={5} trailWidth={4} strokeColor="#32a869" />
              </StyledLineHolder>
              <Spacer size="sm" />
              <StyledLineHolder>
                Against: {numeral(prop.againstVotes).format('0.a')}
                <Line percent={percAgainst} strokeWidth={5} trailWidth={4} strokeColor="#a8324c" />
              </StyledLineHolder>
            </CardContent>
          </Card>
          </StyledCardWrapper>
      
        <Spacer size="md"/>
        <StyledCardWrapper>
        <Card variant='secondary'>
          <CardContent>
            <StyledDescription>
              <span>Description:</span>
            </StyledDescription>
            <Spacer size="sm"/>
            <StyledInfo>
              <span>  {prop.description}</span>
            </StyledInfo>
            <Spacer size="sm"/>
            <Separator />
            <Spacer size="sm"/>
            <StyledDescription>
              <span>Affecting:</span>
            </StyledDescription>
            <Spacer size="sm"/>
            <StyledInfo>
              <span>  {prop.targets}</span>
            </StyledInfo>
            <Spacer size="sm"/>
            <Separator />
            <Spacer size="sm"/>
            <StyledDescription>
              <span>Function Calls:</span>
            </StyledDescription>
            <Spacer size="sm"/>
            <StyledInfo>
            {prop.signatures.map(sig => <code>{sig}</code>)}
            </StyledInfo>
            <Spacer size="sm"/>
            <Separator />
            <Spacer size="sm"/>
            <StyledDescription>
              <span>Inputs:</span>
            </StyledDescription>
            <Spacer size="sm"/>
            <StyledInfo>
              {
                prop.inputs.map((input, i) => {
                  return (<code>{JSON.stringify(input)}</code>)
                })
              }
            </StyledInfo>
          </CardContent>
        </Card>
        </StyledCardWrapper>
      </ModalContent>
      
      <ModalActions>
        <Button
          onClick={onDismiss}
          text="Close"
          variant="tertiary"
        />
        { (prop.state == "Active") && (!voted) && (votePower && votePower > 0) && (
          <>
            <Button
              disabled={isVoting}
              onClick={handleVoteClickTrue}
              text="For"
            />
            <Spacer size="md"/>
            <Button
              disabled={isVoting}
              onClick={handleVoteClickFalse}
              text="Against"
            />
          </>) || (prop.state === "Active") && (!voted) && (
            <span>Unable To Vote. You did not have PHZT in your wallet when this proposal was Created.</span>
          ) || (prop.state === "Pending") && (!voted) 
        
        
         
         || 
          (prop.state === "Succeeded") && (
           <>
            <Button
              disabled={isVoting}
              onClick={handleQueue}
              text="Queue"
            />

           </>

          )
        ||
          (prop.state === "Queued") && (prop.eta * 1000 < Date.now()) && (
           <>
          
            <Button
              disabled={isVoting}
              onClick={handleExecute}
              text="Execute"
            />

           </>

          )
        }
        {
           (prop.id === priorProposal ) && (prop.state != "Executed") && (prop.state != "Defeated") &&(
            <>
             
             <Button
               disabled={isVoting}
               onClick={handleCancel}
               text="Cancel Proposal"
               variant="secondary"
             />
 
            </>
 
           )
        }
      </ModalActions>
       
    
    </Modal>
  )
}

const StyledTitle = styled.h1`
color: ${(props) => props.theme.color.grey[910]};
text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
font-size: 24px;
font-weight: 700;
margin: ${(props) => props.theme.spacing[2]}px 0 0;
padding: 0;
margin-top: 10px;
`

const StyledSubtitle = styled.h3`
  color: #5346a3;
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  opacity: 0.66;
  padding: 0;
  text-shadow: 1px 1px 1px #000000;
`

const StyledLineHolder = styled.div`
  width: 95%;
  font-size: 20px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
`

const StyledDescription = styled.div`
  font-weight: 600;
  font-size: 20px;
`

const StyledInfo = styled.div`
  font-size: 14px;
  width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
  -moz-white-space: pre-wrap;
`
const StyledCardWrapper = styled.div`
  border-radius: 1rem;
  box-shadow: 0 24px 38px 3px ${(props) => props.theme.color.grey[800]},
  0 9px 46px 8px ${(props) => props.theme.color.grey[800]},
  0 11px 15px -7px ${(props) => props.theme.color.grey[800]};
`
const StyledCounter = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  font-family: 'PT Sans', sans-serif;
  justify-content: center;
  flex-direction: column;
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 20px;
  font-weight: 900;
  margin: 0;
  padding: 0;
  text-shadow: 2px 2px 4px #000000;
`
export default VoteModal
