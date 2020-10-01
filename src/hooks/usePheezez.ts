import { useContext } from 'react'
import { Context } from '../contexts/PheezezProvider'

const usePheezez = () => {
  const { pheezez } = useContext(Context)
  return pheezez
}

export default usePheezez
