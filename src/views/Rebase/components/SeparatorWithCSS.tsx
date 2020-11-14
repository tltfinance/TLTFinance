import React, { useContext, useMemo } from 'react'
import styled,  { ThemeContext } from 'styled-components'

type SeparatorOrientation = 'horizontal' | 'vertical'

interface SeparatorProps {
  orientation?: SeparatorOrientation,
  stretch?: boolean,
  gridArea?: string
}

const SeparatorGrid: React.FC<SeparatorProps> = ({ orientation, stretch, gridArea }) => {

  const { color } = useContext(ThemeContext)

  let boxShadow = `0 -1px 0px ${color.grey[300]}, 0 1px 0px ${color.grey[100]}`
  if (orientation === 'vertical') {
    boxShadow = `-1px 0px 0px ${color.grey[300]}, 1px 0px 0px ${color.grey[100]}`
  }

  const Content = useMemo(() => {
    if (gridArea && !stretch) {
      return <StyledSeparatorGrid boxShadow={boxShadow} orientation={orientation} gridArea={gridArea}/>
    } else {
      return <StyledSeparator boxShadow={boxShadow} orientation={orientation} />
    }

  }, [boxShadow, orientation])

  if (stretch && gridArea) {
    return (
      <div style={{ alignSelf: 'stretch', gridArea: gridArea, display: 'grid', justifyContent: 'center' }}>
        {Content}
      </div>
    )
  } else if (stretch) {
    return (
      <div style={{ alignSelf: 'stretch' }}>
        {Content}
      </div>
    )
  }

  return Content
}

interface StyledSeparatorProps {
  boxShadow: string,
  orientation?: SeparatorOrientation,
  gridArea?: string
}

const StyledSeparator = styled.div<StyledSeparatorProps>`
  box-shadow: ${props => props.boxShadow};
  height: ${props => props.orientation === 'vertical' ? '100%' : '1px'};
  width: ${props => props.orientation === 'vertical' ? '1px' : '100%'};
`

const StyledSeparatorGrid = styled.div<StyledSeparatorProps>`
  box-shadow: ${props => props.boxShadow};
  height: ${props => props.orientation === 'vertical' ? '100%' : '1px'};
  width: ${props => props.orientation === 'vertical' ? '1px' : '100%'};
  display: grid;
  grid-area: ${props => props.gridArea};
`

export default SeparatorGrid
