import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'

import styled from 'styled-components'

interface SubValueProps {
  label: string
  value: string | number
  decimals?: number
}

const SubValue: React.FC<SubValueProps> = ({ label, value, decimals }) => {
  const [start, updateStart] = useState(0)
  const [end, updateEnd] = useState(0)

  useEffect(() => {
    if (typeof value === 'number') {
      updateStart(end)
      updateEnd(value)
    }
  }, [value])

  return (
    <StyledSubValue>
      {label}
      {typeof value == 'string' ? (
        value
      ) : (
        <CountUp
          start={start}
          end={end}
          decimals={
            decimals !== undefined ? decimals : end < 0 ? 4 : end > 1e5 ? 0 : 3
          }
          duration={1}
          separator=","
        />
      )}
    </StyledSubValue>
  )
}

const StyledSubValue = styled.div`
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
  'Lucida Sans', Arial, sans-serif;
  color: ${(props) => props.theme.color.grey[906]};
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  font-size: 20px;
  font-weight: 700;
`

export default SubValue
