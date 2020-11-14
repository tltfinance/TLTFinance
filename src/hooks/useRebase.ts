import { useContext } from 'react'
import { Context as RebaseContext } from '../contexts/Rebase'

const useRebase = () => {
  return { ...useContext(RebaseContext) }
}

export default useRebase
