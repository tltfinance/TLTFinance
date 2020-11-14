import { useContext } from 'react'
import { Context as FarmsContext } from '../contexts/FRTFarms'

const useFRTFarms = () => {
  const { farms } = useContext(FarmsContext)
  return [farms]
}

export default useFRTFarms
