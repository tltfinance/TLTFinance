import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react'
import Button from '../../../components/Button'
import Dropdown, {Option, ReactDropdownProps} from 'react-dropdown';
import 'react-dropdown/style.css';
import BigNumber from 'bignumber.js'
import SeparatorGrid from "./SeparatorWithCSS"
import Box from "./BoxWithDisplay"
import useGovernance from '../../../hooks/useGovernance'
import styled from 'styled-components'
import InputText, { InputTextProps } from '../../../components/InputText'
import Split from '../../../components/Split';
import Spacer from '../../../components/Spacer';

interface ErasePoolProps  {
  onSelectPool: (data: (string|number|boolean)[]) => void,
  onInputText: (desc: string) => void,
}


const ErasePool: React.FC<ErasePoolProps> = ({
  onSelectPool,
  onInputText,
}) => {

  const {pools } = useGovernance()
  let update = false;
  const allocPoint = "0";
  //console.log("POOLS", pools)

  const [selected, setSelected] = useState("");
  const [textValue, settextValue] = useState("");
  const handleChange = useCallback((e) => {
    setSelected(e.value)
  },[setSelected] )

  const handleTextChange = useCallback((e) => {
    settextValue(e.target.value)
  },[settextValue] )

  useEffect(() => {
   // console.log("CALLDATAS", selected)
    let ins = []
    ins.push(selected)
    ins.push(allocPoint)
    ins.push(update)
    //console.log("CALLDATAS", ins)
    onSelectPool(ins)
    onInputText(textValue)
  
}, [selected, textValue]);
 
  const items = pools.map(({ name, pid }) => ({ label: name, value: pid.toString() }))
 
 
  return (
    <>
    <StyledMaxText> Select the pool to erase:</StyledMaxText>
    <StyledDropdown>
    <Dropdown options={items}  onChange={handleChange} value={selected} placeholder="Select an option" />
    </StyledDropdown>
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

export default ErasePool
