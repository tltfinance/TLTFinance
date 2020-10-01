import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../constants/ERC20.json'

export const getContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC20ABI.abi as unknown) as AbiItem,
    address,
  )
  //console.log("CONTRACT!!!!!!!!!!!!!!", address, contract)
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  digesterContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods
      .allowance(account, digesterContract.options.address)
      .call()
      //console.log("OK")
    return allowance
  } catch (e) {
    //console.log("ERROR", e)
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  //console.log("TEST4", provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}
