import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getDigesterAddress = (pheezez) => {
  return pheezez && pheezez.digesterAddress
}
export const getPheezezAddress = (pheezez) => {
  return pheezez && pheezez.pheezezAddress
}
export const getWethContract = (pheezez) => {
  return pheezez && pheezez.contracts && pheezez.contracts.weth
}

export const getDigesterContract = (pheezez) => {
  return pheezez && pheezez.contracts && pheezez.contracts.digester
}
export const getPheezezContract = (pheezez) => {
  return pheezez && pheezez.contracts && pheezez.contracts.pheezez
}
export const getethusdContract = (pheezez) => {
  return pheezez && pheezez.contracts && pheezez.contracts.ethusd
}

export const getpheezezethContract = (pheezez) => {
  return pheezez && pheezez.contracts && pheezez.contracts.pheezezeth
}

export const getFarms = (pheezez) => {
  return pheezez
    ? pheezez.contracts.pools.map(
      ({
        pid,
        name,
        symbol,
        icon,
        icon2,
        unipool,
        tokenAddress,
        tokenSymbol,
        tokenContract,
        lpAddress,
        lpContract,
      }) => ({
        pid,
        id: symbol,
        name,
        lpToken: symbol,
        lpTokenAddress: lpAddress,
        lpContract,
        tokenAddress,
        tokenSymbol,
        tokenContract,
        earnToken: 'pheezez',
        earnTokenAddress: pheezez.contracts.pheezez.options.address,
        icon,
        icon2,
        unipool,
      }),
    )
    : []
}

export const getPoolWeight = async (digesterContract, pid) => {
  const { allocPoint } = await digesterContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await digesterContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (digesterContract, pid, account) => {
  return digesterContract.methods.pendingTokens(pid, account).call()
}

//For displaying in front page
export const getCurrentTokensPerBlock = async (digesterContract) => {
  return new BigNumber(await digesterContract.methods.getCurrentRewardPerBlock().call())
}
//Calculate USD prize. //Be extra careful with the Reserves(Which is which)
export const calculateTokenUSDValue = async (ethUsdContract, pheezezEthContract) => {
  const reserves = await ethUsdContract.methods.getReserves().call()
  const reserves2 = await pheezezEthContract.methods.getReserves().call()
  const ethusd = reserves['_reserve1'] / reserves['_reserve0']; // cause USD uses 6 decimal
  const pheezezeth = reserves2['_reserve1'] / reserves2['_reserve0'];  //ETH/Pheezez
  //console.log("TOKEN PRICE", ethusd, pheezezeth, reserves2['_reserve1'], reserves2['_reserve0'])
  const pheezezUSD = pheezezeth * ethusd
  return pheezezUSD
}

//Convert ETH to USD price
export const calculateEtherUSDValue = async (ethUsdContract) => {
  const reserves = await ethUsdContract.methods.getReserves().call()
  const ethusd = reserves['_reserve1'] / reserves['_reserve0']; // cause USD uses 6 decimal
  //console.log("ETH PRICE", ethusd)
  return ethusd
}



export const getTotalLPWethValue = async (
  digesterContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address relative to the Main Token that represents the pool (Not eth)
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that digesterContract owns
  const balance = await lpContract.methods
    .balanceOf(digesterContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1 (POOL TOTAL IN GENERAL)
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1 (TOTAL WETH THAT EXIST ON THE POOLS, some pools do not have weth)
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  //How much LP in comparission with the Total!! (How much staked LP relative to the total LP tokens available)
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  //Conversion to BigNumber (Nothing else)
  const lpWethWorth = new BigNumber(lpContractWeth)
  //Total value in Ether of staked LPs, (times 2 is necesarry as each pool is 50/50 in value)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate the whole staked tokenAmount value (Think about the half value of a LP pool in Token Value)
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))
  // Calculate the whole wethAmount staked (Think about the half value of a LP pool represented in Ether Value)
  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  //console.log("NOSEEEEE", wethAmount.toNumber())
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(digesterContract, pid),
  }
}

export const approve = async (lpContract, digesterContract, account) => {
  return lpContract.methods
    .approve(digesterContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getPheezezSupply = async (pheezez) => {
  return new BigNumber(await pheezez.contracts.pheezez.methods.totalSupply().call())
}

export const stake = async (digesterContract, pid, amount, account) => {
  return digesterContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })

}

export const unstake = async (digesterContract, pid, amount, account) => {
  return digesterContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (digesterContract, pid, account) => {
  return digesterContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (digesterContract, pid, account) => {
  try {
    const { amount } = await digesterContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (digesterContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return digesterContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
