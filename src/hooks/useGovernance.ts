import { useContext } from 'react'
import { Context as GovernanceContext } from '../contexts/Governance'

const useGovernance = () => {
  return { ...useContext(GovernanceContext) }
}

export default useGovernance
