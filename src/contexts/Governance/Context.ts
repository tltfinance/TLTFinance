import { createContext } from 'react'

import { ContextValues } from './types'

const Context = createContext<ContextValues>({
  onVote: () => {},
  onPropose:() => {},
  pools: [],
  onQueue: () => {},
  onExecute: () => {},
  onCancel: () => {},
})

export default Context
