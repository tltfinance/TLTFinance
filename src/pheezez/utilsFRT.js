import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Web3 from 'web3'
import {
  addressMap,
  REBASE_PERIOD
} from './lib/constants'

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


export const getFRTAddress = (frt) => {
  return frt && frt.frtAddress
}
export const getDaiContract = (frt) => {
  return frt && frt.contracts && frt.contracts.dai
}
export const getPoolContract = (frt, id) => {
  return frt && frt.contracts && frt.contracts.frtpools[id].frtPoolContract
}
export const getFRTContract = (frt) => {
  return frt && frt.contracts && frt.contracts.frt
}
export const getFRTDAIContract = (frt) => {
  return frt && frt.contracts && frt.contracts.frtdai
}

export const getFarms = (frt) => {
  return frt
    ? frt.contracts.frtpools.map(
      ({
        pid,
        name,
        symbol,
        icon,
        icon2,
        tokenAddress,
        tokenSymbol,
        tokenContract,
        poolAddress,
        frtPoolContract,
        lpAddress,
        lpContract,
        unipool,
        starttime,
      }) => ({
        pid,
        id: symbol,
        name,
        poolToken: symbol,
        poolAddress,
        frtPoolContract,
        lpTokenAddress: lpAddress,
        lpContract,
        tokenAddress,
        tokenSymbol,
        tokenContract,
        earnToken: 'FRT',
        earnTokenAddress: frt.contracts.frt.options.address,
        icon,
        icon2,
        unipool,
        starttime,
      }),
    )
    : []
}

export const getPoolWeight = async (poolContract) => {
  const allocPoint = await poolContract.methods.initreward().call()
  return new BigNumber(allocPoint).div(new BigNumber(30000).multipliedBy(new BigNumber(10).pow(18)))
}

export const getEarned = async (frt, poolContract, account) => {
  const nowTotSupply = new BigNumber(await frt.contracts.frt.methods.totalSupply().call())
  const originalTotalSupply = new BigNumber(await poolContract.methods.origTotalSupply().call())
  const earned = new BigNumber(await poolContract.methods.earned(account).call())
  const reward = earned.multipliedBy(nowTotSupply).dividedBy(originalTotalSupply)
 // console.log("REWARDS PRICE", reward.toNumber(), earned.toNumber(), originalTotalSupply.toNumber() )
  return reward
}

//For displaying in front page
export const getCurrentFRTPerBlock = async (frt, poolContract) => {
  const nowTotSupply = new BigNumber(await frt.contracts.frt.methods.totalSupply().call())
  const originalTotalSupply = new BigNumber(await poolContract.methods.origTotalSupply().call())
  const rewardRate = new BigNumber(await poolContract.methods.rewardRate().call())
  const currentRewardRate = rewardRate.multipliedBy(nowTotSupply).dividedBy(originalTotalSupply)
  return currentRewardRate
}


/**Depending of the order of the reserves there is going to be a MUL Math.pow or a DIV in order to correct the decimals  */

// FRT to DAI ratio
export const getFRTDAIValue = async (frtdaiContract) => {
  const reserves = await frtdaiContract.methods.getReserves().call()
  const frtdai = reserves['_reserve1'] / reserves['_reserve0']; // DAI is 18 decimals
  //console.log("ETH PRICE", frtdai, reserves['_reserve1'] , reserves['_reserve0']  )
  return frtdai
}

export const getTotalStakedValue = async (
  poolContract,
  daiContract,
  wethContract,
  frtPoolContract,
  tokenContract,
  frtContract,
  lpContract,
  pid,
) => {

  const tokenDecimals = await tokenContract.methods.decimals().call()

   // Get balance of the token address relative to the Main Token that represents the pool (Not eth)
   const tokenAmountWholeLP = await tokenContract.methods
   .balanceOf(lpContract.options.address)
   .call()
 //Get balance of frt in the pool
 const frtAmountWholeLP = await frtContract.methods
   .balanceOf(lpContract.options.address)
   .call()
//How many LP exist on the Pool
 const balanceLP = await lpContract.methods
   .balanceOf(poolContract.options.address)
   .call()
 // Convert that into the portion of total lpContract = p1 (POOL TOTAL IN GENERAL)
 const totalSupplyLP = await lpContract.methods.totalSupply().call()
 // Get total weth value for the lpContract = w1 (TOTAL WETH THAT EXIST ON THE POOLS, some pools do not have weth)
 const lpContractWeth = await wethContract.methods
   .balanceOf(lpContract.options.address)
   .call()
 // Return p1 * w1 * 2
 //How much LP in comparission with the Total!! (How much staked LP relative to the total LP tokens available)
 const portionLp = new BigNumber(balanceLP).div(new BigNumber(totalSupplyLP))
 //Conversion to BigNumber (Nothing else)
 const lpWethWorth = new BigNumber(lpContractWeth)
 //Total value in Ether of staked LPs, (times 2 is necesarry as each pool is 50/50 in value)
 const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
 // Calculate the whole staked tokenLPAmount
 const tokenLPAmount = new BigNumber(tokenAmountWholeLP)
   .times(portionLp)
   .div(new BigNumber(10).pow(tokenDecimals))
 // Calculate the whole staked frtAmount value (Think about the half value of a LP pool in frt Amount)
 const frtAmount = new BigNumber(frtAmountWholeLP)
   .times(portionLp)
   .div(new BigNumber(10).pow(18))
 // Calculate the whole wethAmount staked (Think about the half value of a LP pool represented in Ether Amount)
 const wethAmount = lpWethWorth.times(portionLp).div(new BigNumber(10).pow(18))
  
 

  //Get balance of total frt rewards in the pool
  const frtAmountWhole = await frtContract.methods
    .balanceOf(frtPoolContract.options.address)
    .call()

  // Get balance of the total tokens Staked on the Pool
  const balance = await tokenContract.methods
    .balanceOf(poolContract.options.address)
    .call()

  // Total Supply of staked Token
  const totalSupply = await tokenContract.methods.totalSupply().call()

  // Get total Dai value for the LPPoolContract = w1 (TOTAL DAI THAT EXIST ON THE POOLS, some pools do not have DAI)
  const lpContractDAI = await daiContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  //Conversion to BigNumber (Nothing else)
  const lpDAIWorth = new BigNumber(lpContractDAI)
  //Total value in Dai of staked LPs, (times 2 is necesarry as each pool is 50/50 in value)
  const totalLpValue = portionLp.times(lpDAIWorth).times(new BigNumber(2))

  // Calculate the whole staked tokenAmount value
  const tokenAmount = new BigNumber(balance).div(new BigNumber(10).pow(tokenDecimals))


  // Calculate the whole daiAmount staked (Think about the half value of a LP pool represented in DAI Amount)
  const daiAmount = lpDAIWorth.times(portionLp).div(new BigNumber(10).pow(18))

  //console.log("WHAT?", totalSupply, "WETH:", wethAmount.toNumber() , "TOKENLPAM:",tokenLPAmount.toNumber(), tokenAmount.toNumber(), frtAmount.toNumber(), daiAmount.toNumber(), totalLpValue.div(new BigNumber(10).pow(18)).toNumber()  )
  return {
    tokenAmount,
    tokenLPAmount,
    frtAmount,
    daiAmount,
    totalDaiValue: totalLpValue.div(new BigNumber(10).pow(18)),
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInDai: daiAmount.div(tokenLPAmount),
    tokenPRiceinEther: wethAmount.div(tokenLPAmount),
    poolWeight: await getPoolWeight(poolContract, pid),
  }
}

export const approve = async (frtPoolContract, poolContract, account) => {
  return frtPoolContract.methods
    .approve(poolContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getFRTSupply = async (frt) => {
  return new BigNumber(await frt.contracts.frt.methods.totalSupply().call())
}

export const stake = async (poolContract, amount, account) => {
  return poolContract.methods
    .stake(
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })

}

export const unstake = async (poolContract, amount, account) => {
  return poolContract.methods
    .withdraw(
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (poolContract, account) => {
  return poolContract.methods
    .getReward()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (poolContract, account) => {
  try {
    const amount = await poolContract.methods
      .balanceOf(account)
      .call()
    
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (poolContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return poolContract.methods
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
export const waitTransaction = async (provider, txHash) => {
  const web3 = new Web3(provider)
  let txReceipt = null
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash)
    txReceipt = r
    await sleep(2000)
  }
  return (txReceipt.status)
}
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export const rebase = async (frt, account, onTxHash) => {
  return frt.contracts.frtRebaser
  .methods
  .rebase().send(
    { from: account, gas: 250000 },
    async (error, txHash) => {
      if (error) {
        onTxHash && onTxHash('')
        console.log("Rebase error", error)
        return false
      }
      onTxHash && onTxHash(txHash)
      const status = await waitTransaction(frt.web3.eth, txHash)
      if (!status) {
        console.log("Rebase transaction failed.")
        return false
      }
      return true
    })
}

export const getRebases = async (frt) => {
  let BASE18 = new BigNumber(10).pow(18);

  ///Change blocks

  const tltRebases = await frt.contracts.frtRebaser.getPastEvents("LogRebase", { fromBlock: 7270000, toBlock: 'latest' }) //change
  
  
  let rebases = [];
  //ARREGLAR
  if (tltRebases.length > 0)
  {

  
  for (let i = tltRebases.length - 1; i > tltRebases.length - 25 && i >= 0; i--) {

    let epoch = tltRebases[i]["returnValues"]["epoch"]
    let totalSupply = tltRebases[i]["returnValues"]["totalSupply"]
    let reward = tltRebases[i]["returnValues"]["rand"];
    let rebaser = tltRebases[i]["returnValues"]["account"]
    let blockNumber = tltRebases[i]["blockNumber"];
    let blockObject = await frt.web3.eth.getBlock(blockNumber)
    let txReceipt = await frt.web3.eth.getTransactionReceipt(tltRebases[i]["transactionHash"])
    let amount = new BigNumber(0)
    let address = ""
    
    for (let j = 0; j < txReceipt["logs"].length; j++) {
       address = txReceipt["logs"][j]["address"]
      // console.log("Rebases", address)
      if (address === addressMap.FRT && txReceipt["logs"][j]["topics"][0] ==="0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
        //console.log("Rebases", txReceipt["logs"][j]["topics"][0])
        amount = new BigNumber(parseInt(txReceipt["logs"][j]["data"])).div(BASE18)
      } 
    }
    

    //console.log("Rebases", txReceipt["logs"][j]["address"] )

    rebases.push({
      rebaser: rebaser,
      reward: amount.toNumber(),
      totalSupply: totalSupply,
      id: epoch,
      date: blockObject.timestamp,
      hash: tltRebases[i]["transactionHash"],
    });
  }
}
  return rebases;

}

export const getPools = (frt) => {
  return frt
    ? frt.contracts.frtpools.map(
      ({
        pid,
        name,
        poolAddress,
      }) => ({
        pid,
        name,
        poolAddress,
      }),
    )
    : []
}

export const formatTime = (timestamp) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(timestamp * 1000)
  // Hours part from the timestamp
  //console.log("Time",new Date(date).toDateString())

  let hours = date.getHours()
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes()
  // Seconds part from the timestamp
  let seconds = "0" + date.getSeconds()

  let days = new Date(date).toDateString()

  // Will display time in 10:30:23 format
  let formattedTime = days + ' '+ hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  return formattedTime
}

export const getNextHour = (timeinMiliSeconds) => {
  let date = new Date()
  let hours = date.getHours()
  let days = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()


  let thisHour = month + ' ' + days + ' ' + year + ' ' + hours + ':' + "00" + ':' + "00"
  let thisHourTimeStamp = Date.parse(thisHour);
  let nextHourTimeStamp = thisHourTimeStamp + timeinMiliSeconds
  //console.log(nextHourTimeStamp, Date.now())
  return nextHourTimeStamp
}

export const getFRtBalance = async (frt, account) => {
  let BASE18 = new BigNumber(10).pow(18);
  return new BigNumber(await frt.contracts.frt.methods.balanceOf(account).call()).dividedBy(BASE18).toNumber()
}

export const obtainPriorVotesinPool = async (frt, poolContract, account, block) => {
  let BASE18 = new BigNumber(10).pow(18);
  return new BigNumber(await poolContract.methods.getPriorVotesinPool(account, block).call()).dividedBy(BASE18).toNumber()
}

export const getCurrentVotingPowerinPool = async (frt, poolContract, account) => {
  let BASE18 = new BigNumber(10).pow(18);
  return new BigNumber(await poolContract.methods.getCurrentVotesinPool(account).call()).dividedBy(BASE18).toNumber()
}

export const isRebasable = async (frt, frtdaiContract, account) => {
  let lastRebaser = await frt.contracts.frtRebaser.methods.lastRebaser().call()
  //let starttime = await frt.contracts.frtRebaser.methods.starttime().call()

  //console.log("TIME", starttime)

  if (lastRebaser == account)
  {
    return "same"
  }
  let priceCumulativeLast = new BigNumber(await frt.contracts.frtRebaser.methods.price0CumulativeLast().call())
  let priceCumulative =  new BigNumber(await frtdaiContract.methods.price0CumulativeLast().call())
  let blockLast =  new BigNumber(await frt.contracts.frtRebaser.methods.blockTimestampLast().call())
  let reserves = await frtdaiContract.methods.getReserves().call()
  let blockTimesTamp =  new BigNumber(reserves["_blockTimestampLast"])

  let timeElapsed = blockTimesTamp.minus(blockLast)
  if (timeElapsed < REBASE_PERIOD)
  {
    return "period"
  }
  
  let priceAvarage = priceCumulative.minus(priceCumulativeLast).dividedBy(timeElapsed)
  let price = priceAvarage.multipliedBy(new BigNumber(10).pow(3)).dividedBy(new BigNumber(2).pow(112))
  price = Math.floor(price.toNumber())
  //console.log("RESERVS",price, timeElapsed, priceCumulative, priceCumulativeLast)
  if (price == 1000 || price == 999)
  {
    console.log("RESERVS",price, timeElapsed.toNumber(), priceCumulative.toNumber(), priceCumulativeLast.toNumber())
    return "price"
  }

  console.log("RESERVS",price)
 return "yes"
}