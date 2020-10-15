import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react'
import 'react-dropdown/style.css';
import useGovernance from '../../../hooks/useGovernance'
import styled from 'styled-components'
import InputText, { InputTextProps } from '../../../components/InputText'
import Input, { InputProps } from '../../../components/Input'
import Spacer from '../../../components/Spacer';

interface AddPoolProps  {
  onSelectPool: (data: (string|number|boolean)[]) => void,
  onInputText: (desc: string) => void,
}


const AddPool: React.FC<AddPoolProps> = ({
  onSelectPool,
  onInputText,
}) => {

  const {pools } = useGovernance()
  let update = false;
  //console.log("POOLS", pools)

  const [alloc, setAlloc] = useState("")
  const [selected, setSelected] = useState("")
  const [textValue, settextValue] = useState("")
  const handleChange = useCallback((e) => {
    setSelected(e.target.value)
  },[setSelected] )

  const handleTextChange = useCallback((e) => {
    settextValue(e.target.value)
  },[settextValue] )

  const handleAllocChange = useCallback((e) => {
    setAlloc(e.target.value)
  },[setAlloc] )

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
 
  const items = pools.map(({ name, pid }) => ({ label: name, value: pid.toString() }))
 
 
  return (
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
        placeholder="Write the Pool Weight e.g.(100 or any number)"
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

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

const StyledDropdown = styled.div`
  position: relative;
  z-index: 4;
`

const StyledSpacer = styled.div`
  width: ${props => props.theme.spacing[3]}px;
`

const StyledAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
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

const StyledSymbol = styled.span`
  color: ${props => props.theme.color.grey[700]};
  text-shadow: 1px 1px 1px #000000;
  font-weight: 700;
`

export default AddPool
