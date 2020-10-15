import React, { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import usePheezez from '../../hooks/usePheezez'
import {
  getProposals,
  vote,
  propose,
  getVotingPowers,
  getCurrentVotingPower,
  encodeABI,
  getPools,
  queueProposal,
  executeProposal,
  cancelProposal,
} from '../../pheezez/utils'

import Context from './Context'

import { Proposal, ProposalVotingPower } from "./types"

const GovProvider: React.FC = ({ children }) => {
  const { account } = useWallet()
  const pheezez = usePheezez()
  const pools = getPools(pheezez)

  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isProposing, setIsProposing] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>()
  const [votingPowers, setVotingPowers] = useState<ProposalVotingPower[]>()
  const [currentPower, setCurrentPower] = useState<number>()
  
  const fetchProposals = useCallback(async () => {
    if (!pheezez) return;
    let props: Proposal[] = await getProposals(pheezez);
    props = props.sort((a, b) => {
      if (a && b && a.end && b.end) {
        if (a.end === b.end) {
          return 0
        }
        if (a.end < b.end) {
          return 1
        } else {
          return -1
        }
      } else {
        return 0
      }

    });
    let votingPowers: ProposalVotingPower[] = await getVotingPowers(pheezez, props, account);
    setProposals(props);
    setVotingPowers(votingPowers);
  }, [
    setProposals,
    setVotingPowers,
    pheezez,
  ])
 
  
 
  const fetchCurrentPower = useCallback(async () => {
    if (!pheezez) return;
    let votingPower: number = await getCurrentVotingPower(pheezez, account);
    setCurrentPower(votingPower);
  }, [
    setCurrentPower,
    pheezez,
  ])

  const handleVote = useCallback(async (proposal: number, side: boolean) => {
    if (!pheezez) return
    setConfirmTxModalIsOpen(true)
    await vote(pheezez, proposal, side, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsVoting(true)
    })
    setIsVoting(false)
    
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsVoting,
    pheezez
  ])

  const handleQueue = useCallback(async (proposal: number) => {
    if (!pheezez) return
    setConfirmTxModalIsOpen(true)
    await queueProposal(pheezez, proposal, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsVoting(true)
    })
    setIsVoting(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsVoting,
    pheezez
  ])

  const handleCancel = useCallback(async (proposal: number) => {
    if (!pheezez) return
    setConfirmTxModalIsOpen(true)
    await cancelProposal(pheezez, proposal, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsVoting(true)
    })
    setIsVoting(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsVoting,
    pheezez
  ])
 
  const handleExecute = useCallback(async (proposal: number) => {
    if (!pheezez) return
    setConfirmTxModalIsOpen(true)
    await executeProposal(pheezez, proposal, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsVoting(true)
    })
    setIsVoting(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsVoting,
    pheezez
  ])

  const handlePropose = useCallback(async (targets: string[], values: number[], signatures: string[], inputs: (string|number|boolean)[], action: string, description?: string) => {
    if (!pheezez) return
    setConfirmTxModalIsOpen(true)
    

    let callbytes = encodeABI(pheezez, inputs, action)
    await propose(pheezez, targets, values, signatures, [callbytes], description, account,  () => {
      setConfirmTxModalIsOpen(false)
      setIsProposing(true)
    })
    setIsProposing(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsProposing,
    pheezez
  ])
  
  
  useEffect(() => {
    if (pheezez) {
      fetchProposals()
      fetchCurrentPower()
    }
  }, [
    fetchProposals,
    fetchCurrentPower,
    pheezez,
  ])

  useEffect(() => {
    if (pheezez) {
      fetchProposals()
      let refreshInterval = setInterval(fetchProposals, 100000)
      return () => clearInterval(refreshInterval)
    }
  }, [
    pheezez,
    fetchProposals,
  ])

  return (
    <Context.Provider value={{
      proposals,
      pools,
      votingPowers,
      confirmTxModalIsOpen,
      isVoting,
      currentPower,
      onVote: handleVote,
      onPropose: handlePropose,
      onQueue: handleQueue,
      onExecute: handleExecute,
      onCancel: handleCancel,
    }}>
      {children}
    </Context.Provider>
  )
}

export default GovProvider
