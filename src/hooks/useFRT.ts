import { useContext } from 'react'
import { Context } from '../contexts/FRTProvider'

const useFRT = () => {
  const { frt } = useContext(Context)
  return frt
}

export default useFRT
