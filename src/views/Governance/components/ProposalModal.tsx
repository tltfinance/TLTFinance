import React, { useCallback, useMemo, useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import CardContent from '../../../components/CardContent'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import styled from 'styled-components'
import usePheezez from '../../../hooks/usePheezez'
import { useWallet } from 'use-wallet'
import Split from '../../../components/Split'
import ErasePool from './ErasePool'
import UpdatePool from './UpdatePool'
import AddPool from './AddPool'
import { getThreshold, obtainPriorVotes, getDigesterAddress } from '../../../pheezez/utils'
import useBlock from '../../../hooks/useBlock'

interface ProposalModalProps extends ModalProps {
  onConfirm: (targets: string[], values: number[], signatures: string[], inputs: string[], action: string, description?: string) => void
}

const ProposalModal: React.FC<ProposalModalProps> = ({
  onDismiss,
  onConfirm,
}) => {


  const { account } = useWallet()
  const pheezez = usePheezez()
  const block = useBlock()
  const digesterAddress = getDigesterAddress(pheezez)

  const options = [
    { value: 'DeletePool', label: 'Erase Pool' },
    { value: 'UpdatePool', label: 'Update Pool' },
    { value: 'AddtoPool', label: 'Add new LP Pool' },
  ];

  const [value, setValue] = useState("")
  const [threshold, setThreshold] = useState(0)
  const [priorVotes, setPriorVotes] = useState(0)
  const [selectedValue, setselectedValue] = useState([])
  const [inputValue, setinputValue] = useState("")
  const [pendingTx, setPendingTx] = useState(false)
  const [target, setTarget] = useState("")
  const [action, setAction] = useState("")
  const [signature, setSignature] = useState("")


  useEffect(() => {
    async function fetchProposalThreshold() {
      const thres = await getThreshold(pheezez)
      setThreshold(thres)
    }
    if (pheezez) {
      fetchProposalThreshold()
    }
  }, [pheezez, setThreshold])

  useEffect(() => {
    async function fetchPriorVotes() {
      if (block > 0) {
        let counter = block - 1
        const votes = await obtainPriorVotes(pheezez, account, counter)
        setPriorVotes(votes)
      }
    }
    if (pheezez) {
      fetchPriorVotes()
    }
  }, [pheezez, setPriorVotes, block])

  useEffect(() => {
    if (value === "DeletePool") {
      setTarget(digesterAddress)
      setAction("delete")
      setSignature("set(uint256,uint256,bool)")
    }
    else if (value === "UpdatePool") {
      setTarget(digesterAddress)
      setAction("update")
      setSignature("set(uint256,uint256,bool)")
    }
    else if (value === "AddtoPool") {
      setTarget(digesterAddress)
      setAction("add")
      setSignature("add(uint256,address,bool)")

    }
  }, [value, setTarget, setAction, setSignature, digesterAddress]);

  const handleSelect = useCallback(
    (a) => {
      setselectedValue(a)
    },
    [setselectedValue],
  )

  const handleInput = useCallback(
    (a) => {
      setinputValue(a)
    },
    [setinputValue],
  )




  return (
    <Modal>
      <ModalTitle text="Proposal Overview" />
      <ModalContent>
        <Split>
          <CardContent>
            <Dropdown options={options} onChange={(e) => setValue(e.value)} value={value} placeholder="Select an option" />
            {(value === 'DeletePool') && (<ErasePool onSelectPool={handleSelect} onInputText={handleInput} />) ||
             (value === 'UpdatePool') && (<UpdatePool onSelectPool={handleSelect} onInputText={handleInput} />) ||
             (value === 'AddtoPool') && (<AddPool onSelectPool={handleSelect} onInputText={handleInput} />)}



          </CardContent>


        </Split>





      </ModalContent>

      <ModalActions>
        <Button
          disabled={priorVotes < threshold || selectedValue[1] === "" || selectedValue[0] === "" || value === "" ? true : pendingTx}
          text={pendingTx ? 'Pending Confirmation' : 'Propose'}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm([target], [0], [signature], selectedValue, action, inputValue)
            setPendingTx(false)
            onDismiss()
          }}
          variant="tertiary"
        />
      </ModalActions>

      <ModalActions>
        <Button
          onClick={onDismiss}
          text="Close"
          variant="tertiary"
        />
      </ModalActions>

    </Modal>
  )
}


const StyledTitle = styled.h1`
  color: ${props => props.theme.textColor};
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${props => props.theme.textColor};
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  opacity: 0.66;
  padding: 0;
`

const StyledLineHolder = styled.div`
  width: 80%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
`

const StyledDescription = styled.div`
  font-weight: 600;
  font-size: 20px;
`

const StyledInfo = styled.div`
  font-size: 14px;
`
export default ProposalModal
