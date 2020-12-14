import React from 'react'
import styled from 'styled-components'

export interface InputProps {
  endAdornment?: React.ReactNode,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
  placeholder?: string,
  startAdornment?: React.ReactNode,
  value: string,
}

const Input: React.FC<InputProps> = ({
  endAdornment,
  onChange,
  placeholder,
  startAdornment,
  value,
}) => {
  return (
    <StyledInputWrapper>
      {!!startAdornment && startAdornment}
      <StyledInput type="number" min="0" placeholder={placeholder} value={value} onChange={onChange} />
      {!!endAdornment && endAdornment}
    </StyledInputWrapper>
  )
}

const StyledInputWrapper = styled.div`
  align-items: center;
  background-color: #4b2c70;
  border-radius: 50px;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
    inset -2px -7px 10px ${props => props.theme.color.grey[300]};
  display: flex;
  height: 72px;
  padding: 0 ${props => props.theme.spacing[3]}px;
`

const StyledInput = styled.input`
  background: none;
  border: 0;
  color: white;
  text-shadow: 1px 1px 1px #000000;
  font-size: 18px;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
  &::-webkit-inner-spin-button{ display: none; }
  -moz-appearance:textfield;
`

export default Input