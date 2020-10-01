import React from 'react'
import logo from '../../assets/img/logo.png'

interface TokenIconProps {
  size?: number
  v1?: boolean
  v2?: boolean
  v3?: boolean
}

const TokenIcon: React.FC<TokenIconProps> = ({ size = 36, v1, v2, v3 }) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? 'saturate(0.5)' : undefined,
    }}
  >
    {logo}
  </span>
)

export default TokenIcon
