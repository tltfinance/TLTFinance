import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react'
import 'react-dropdown/style.css';
import useGovernance from '../../../hooks/useGovernance'
import { useWallet } from 'use-wallet'
import styled from 'styled-components'
import InputText, { InputTextProps } from '../../../components/InputText'
import Input, { InputProps } from '../../../components/Input'
import Spacer from '../../../components/Spacer'
import Button from '../../../components/Button'
import usePheezez from '../../../hooks/usePheezez'
import {
  createUNIPAIR
} from '../../../pheezez/utils'


interface AddPoolProps {
  onSelectPool: (data: (string | number | boolean)[]) => void,
  onInputText: (desc: string) => void,
}


const AddPool: React.FC<AddPoolProps> = ({
  onSelectPool,
  onInputText,
}) => {

  const pheezez = usePheezez()
  const { account } = useWallet()

  let update = false;
  //console.log("POOLS", pools)
 
  const [alloc, setAlloc] = useState("")
  const [selected, setSelected] = useState("")
  const [textValue, settextValue] = useState("")
  const [lpValue, setLPValue] = useState("")
  const [pendingTx, setPendingTx] = useState(false)
  const [lpPair, setLPPair] = useState(false) 

  const handleChange = useCallback((e) => {
    setSelected(e.target.value)
  }, [setSelected])

  const handleLPChange = useCallback((e) => {
    setLPValue(e.target.value)
  }, [setLPValue])

  const handleTextChange = useCallback((e) => {
    settextValue(e.target.value)
  }, [settextValue])

  const handleAllocChange = useCallback((e) => {
    setAlloc(e.target.value)
  }, [setAlloc])


  const handleUNISWAP = useCallback((e) => {
      async function fetchUNIPAIR() {
        setPendingTx(true)
        try
        {
          const pair = await createUNIPAIR(pheezez, e, account)
          setSelected(pair)
          if (pair != "error" || pair != null)
        {
          setLPPair(true)
        }

        }
        catch(error)
        {
          console.log("EVENT", error)
        }
        //console.log("EVENT", pair)
        setPendingTx(false)
        
      }
      fetchUNIPAIR()
  }, [setPendingTx, setSelected, setLPPair])

  const handleSkip = useCallback(() => {
    setLPPair(true)
  }, [setLPPair])

 
  useEffect(() => {
    //console.log("CALLDATAS", selected)
    let ins = []
    ins.push(alloc)
    ins.push(selected)
    ins.push(update)
    // console.log("CALLDATAS", ins)
    onSelectPool(ins)
    onInputText(textValue)

  }, [selected, textValue, alloc]);

  

  return (
    <>
      {
        (lpPair == false) && (
          <>
            <StyledWarning>Before adding a new Pool, you need to create a UNISWAP Liquidity Pair.</StyledWarning>
            <StyledWarning>We provide a convenience function to you. Follow the steps below. (This is a UNISWAP Transaction)</StyledWarning>
            <Spacer></Spacer>
            <StyledMaxText>Input the Ethereum-Address of the Token that you want to Pair with PHZT.</StyledMaxText>
            <Spacer></Spacer>
            <InputText
              endAdornment={(
                <StyledAdornmentWrapper>
                  <StyledSpacer />
                </StyledAdornmentWrapper>
              )}
              onChange={handleLPChange}
              placeholder="Write the Ethereum Address of the Token"
              value={lpValue}
            />
            <Spacer></Spacer>
            <Block>
              <Button
                disabled={lpValue === "" ? true : pendingTx}
                text={pendingTx ? 'Pending Confirmation' : 'Create Uniswap Pair'}
                onClick={async () => {
                  
                  await handleUNISWAP(lpValue)
                  
                }}
                variant="tertiary"
              />
              <Spacer />
              <Button
                text='Skip'
                onClick={handleSkip}
                variant="secondary" />
            </Block>
          </>

        )
        ||
        (lpPair != false) && (
          <>
            <StyledMaxText> Enter the LP Ethereum Address of the Pool to add:</StyledMaxText>
            <InputText
              endAdornment={(
                <StyledAdornmentWrapper>
                  <StyledSpacer />
                </StyledAdornmentWrapper>
              )}
              onChange={handleChange}
              placeholder="Write the new Pool Address"
              value={selected}
            />
            <Spacer></Spacer>
            <Input
              endAdornment={(
                <StyledAdornmentWrapper>
                  <StyledSpacer />
                </StyledAdornmentWrapper>
              )}
              onChange={handleAllocChange}
              placeholder="Write the Pool Weight (Values from 100 to 1000)"
              value={alloc}
            />
            <Spacer></Spacer>
            <InputText
              endAdornment={(
                <StyledAdornmentWrapper>
                  <StyledSpacer />
                </StyledAdornmentWrapper>
              )}
              onChange={handleTextChange}
              placeholder="Write a short description for the Proposal"
              value={textValue}
            />
          </>
        )
      }

    </>
  )
}




const StyledSpacer = styled.div`
  width: ${props => props.theme.spacing[3]}px;
`

const StyledAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`
const Block = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`
const StyledMaxText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.grey[904]};
  text-shadow: 1px 1px 1px #000000;
  display: flex;
  font-size: 20px;
  font-weight: 900;
  height: 44px;
  justify-content: flex-start;
`

const StyledWarning = styled.div`
  align-items: center;
  text-align: center;
  color: red;
  text-shadow: 1px 1px 1px #000000;
  display: flex;
  font-size: 17px;
  font-weight: 900;
  height: 44px;
  justify-content: flex-start;
`

const StyledSymbol = styled.span`
  color: ${props => props.theme.color.grey[700]};
  text-shadow: 1px 1px 1px #000000;
  font-weight: 700;
`

export default AddPool
