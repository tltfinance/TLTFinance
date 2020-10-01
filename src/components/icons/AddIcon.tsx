import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import styled from 'styled-components'

import { IconProps } from '../Icon'

const AddIcon: React.FC<IconProps> = ({ color, size = 24 }) => {
  const { color: themeColor } = useContext(ThemeContext)
  return (
    <StyledIcon>
      <i className="fas fa-plus"></i>
    </StyledIcon>
  )
}

const StyledIcon = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`

export default AddIcon