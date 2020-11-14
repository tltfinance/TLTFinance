import React, { useCallback, useMemo, useState, Fragment } from 'react'
import Button from '../../../components/Button'
import SeparatorGrid from "./SeparatorWithCSS"
import Box from "./BoxWithDisplay"
import numeral from 'numeral'

import styled from 'styled-components'
import { RebaseList } from "../../../contexts/Rebase/types"
import {formatTime} from "../../../pheezez/utilsFRT"
import { format } from 'url'

interface RebaseListProps {
  reb: RebaseList,
}

export const RebaseListEntry: React.FC<RebaseListProps> = ({
  reb,
}) => {

  const formattedTime = formatTime(reb.date)
  const  truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...' + str.slice(36)
  }

  return (
    <Fragment>
      <Box
        display="grid"
        alignItems="center"
        padding={4}
        row
      >
        <StyledProposalContentInner>
          <StyledDescription>{formattedTime}</StyledDescription>
          <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer1'} />
          <StyledAddress>{truncateString(reb.rebaser,6)}</StyledAddress>
          <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer2'} />
          <StyledState>{numeral(reb.reward).format('0,0.000')} FRT</StyledState>
          <SeparatorGrid orientation={'vertical'} stretch={true} gridArea={'spacer3'} />
          <StyledButton>
            <Button
              size="sm"
              href={"https://etherscan.io/tx/" + reb.hash}
              text="View"
              variant="tertiary"
            />
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
  text-align: center;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`
export const StyledAddress = styled.span`
  display: grid;
  grid-area: who;
  text-align: center;
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
  text-align: center;
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
  grid-template-columns: 25fr 5px  20fr 5px 15fr 5px 18fr;
  grid-template-areas: "desc spacer1 who spacer2 state spacer3 vote";
  grid-template-rows: 100fr;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
  }
`
