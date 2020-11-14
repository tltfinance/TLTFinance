import React from 'react'
import styled from 'styled-components'

interface LabelProps {
  text?: string
}

const Label: React.FC<LabelProps> = ({ text }) => (
  <StyledLabel>{text}</StyledLabel>
)

const StyledLabel = styled.div`
  color: ${(props) => props.theme.color.grey[700]};
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px #000000;
`

export default Label
