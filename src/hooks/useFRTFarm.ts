import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/FRTFarms'

const useFRTFarm = (id: string): Farm => {
  const { farms } = useContext(FarmsContext)
  const farm = farms.find((farm) => farm.id === id)
  return farm
}

export default useFRTFarm
