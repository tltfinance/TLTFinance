import React, { useCallback, useMemo, useState, Fragment } from 'react'
import Button from '../../../components/Button'
import BigNumber from 'bignumber.js'
import SeparatorGrid from "./SeparatorWithCSS"
import Box from "./BoxWithDisplay"
import useModal from '../../../hooks/useModal'
import useGovernance from '../../../hooks/useGovernance'

import styled from 'styled-components'
import { Proposal, ProposalVotingPower } from "../../../contexts/Governance/types"
import VoteModal from './VoteModal'

interface ProposalProps {
  prop: Proposal,
  onVote: (proposal: number, side: boolean) => void,
  onQueue: (proposal: number) => void,
  onExecute: (proposal: number) => void,
  onCancel: (proposal: number) => void,
}

export const ProposalEntry: React.FC<ProposalProps> = ({
  prop,
  onVote,
  onQueue,
  onExecute,
  onCancel,
}) => {
  const { isVoting, votingPowers, currentPower } = useGovernance();

  const handleOnVote = useCallback((proposal: number, side: boolean,) => {
    onVote(proposal, side)
  }, [onVote])

  const handleOnQueue = useCallback((proposal: number) => {
    onQueue(proposal)
  }, [onQueue])

  const handleOnExecute = useCallback((proposal: number) => {
    onExecute(proposal)
  }, [onExecute])

  const handleOnCancel = useCallback((proposal: number) => {
    onCancel(proposal)
  }, [onCancel])

  const [onPresentVote] = useModal(
    <VoteModal
      key={prop.id.toString()}
      prop={prop}
      onVote={handleOnVote}
      onQueue={handleOnQueue}
      onExecute={handleOnExecute}
      onCancel={handleOnCancel}
    />,
  )

  return (
    <Fragment>
      <Box
        display="grid"
        alignItems="center"
        padding={4}
        row
      >
        <StyledProposalContentInner>
          <StyledDescription>{prop.description}</StyledDescription>
          <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer1'} />
          <StyledState>{prop.state}</StyledState>
          <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer2'} />
          <StyledButton>
            {(prop.state !== "Active") && (<Button
              size="sm"
              onClick={onPresentVote}
              text="View"
              variant="tertiary"
            />)
              || (prop.state === "Active") && (
                <Button
                  size="sm"
                  text="Vote"
                  onClick={onPresentVote}
                />
              )
            }
          </StyledButton>
        </StyledProposalContentInner>
      </Box>

    </Fragment>
  )
}


export const StyledButton = styled.div`
  display: grid;
  grid-area: vote;
  margin-left: 10px;
  justify-content: center;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`

export const StyledDescription = styled.span`
  display: grid;
  grid-area: desc;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`

export const StyledState = styled.span`
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

export const StyledProposalContentInner = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 70fr 5px 12fr 5px 18fr;
  grid-template-areas: "desc spacer1 state spacer2 vote";
  grid-template-rows: 100fr;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
  }
`
