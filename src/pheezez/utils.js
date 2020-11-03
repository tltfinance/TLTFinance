import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Web3 from 'web3'

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
        earnToken: 'PHZT',
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
  const ethusd = reserves['_reserve1'] / reserves['_reserve0'] * Math.pow(10, 18 - 6);  // cause USD uses 6 decimal
  const pheezezeth = reserves2['_reserve1'] / reserves2['_reserve0'];  //ETH/Pheezez
  //console.log("TOKEN PRICE", ethusd, pheezezeth, reserves2, reserves2)
  const pheezezUSD = pheezezeth * ethusd
  return pheezezUSD
}


//Convert ETH to USD price
export const calculateEtherUSDValue = async (ethUsdContract) => {
  const reserves = await ethUsdContract.methods.getReserves().call()
  const ethusd = reserves['_reserve1'] / reserves['_reserve0'] * Math.pow(10, 18 - 6); // cause USD uses 6 decimal
  //console.log("ETH PRICE", ethusd)
  return ethusd
}



export const getTotalLPWethValue = async (
  digesterContract,
  wethContract,
  lpContract,
  tokenContract,
  pheezezContract,
  pid,
) => {
  // Get balance of the token address relative to the Main Token that represents the pool (Not eth)
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  //Get balance of pheezez in the pool (Not eth)
  const pheezezAmountWholeLP = await pheezezContract.methods
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
  // Calculate the whole staked pheezezAmount value (Think about the half value of a LP pool in Pheezez Value)
  const pheezezAmount = new BigNumber(pheezezAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  // Calculate the whole wethAmount staked (Think about the half value of a LP pool represented in Ether Value)
  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  //console.log("WHAT?", wethAmount.toNumber())
  return {
    tokenAmount,
    pheezezAmount,
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


export const getPools = (pheezez) => {
  return pheezez
    ? pheezez.contracts.pools.map(
      ({
        pid,
        name,
        lpAddress,
      }) => ({
        pid,
        name,
        lpTokenAddress: lpAddress,
      }),
    )
    : []
}

export const createUNIPAIR = async (pheezez, tokenAddress, account, onTxHash) => {

  console.log("PROPOSAL", pheezez.pheezezAddress, tokenAddress, pheezez.contracts.unifactory
  .methods)
  let result = await pheezez.contracts.unifactory
    .methods
    .createPair(tokenAddress, pheezez.pheezezAddress).send(
      { from: account, gas: 3747564 },
      async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash('')
          console.log("Pair Creation error", error)
          return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(pheezez.web3.eth, txHash)
        if (!status) {
          console.log("Pair Creation transaction failed.")
          return false
        }
        return true
      })
  if (result != null)
  {
    return result.events.PairCreated.returnValues.pair
  }
  else
  {
    return "error"
  }
}

export const encodeABI = (pheezez, parameters, action) => {
  if (action === "delete" || "update") {

    let result = pheezez.web3.eth.abi.encodeParameters(['uint256', 'uint256', 'bool'], parameters)
    return result
  }
  else if (action === "add") {
    let result = pheezez.web3.eth.abi.encodeParameters(['uint256', 'address', 'bool'], parameters)
    return result
  }

}
export const propose = async (pheezez, targets, values, signatures, callbytes, description, account, onTxHash) => {

  //console.log("PROPOSAL", targets, values, signatures, callbytes, description)
  return pheezez.contracts.gov
    .methods
    .propose(targets, values, signatures, callbytes, description).send(
      { from: account, gas: 500000 },
      async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash('')
          console.log("Proposal error", error)
          return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(pheezez.web3.eth, txHash)
        if (!status) {
          console.log("Proposal transaction failed.")
          return false
        }
        return true
      })
}

export const queueProposal = async (pheezez, proposal, account, onTxHash) => {
  return pheezez.contracts.gov
    .methods
    .queue(proposal).send(
      { from: account, gas: 200000 },
      async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash('')
          console.log("Queue error", error)
          return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(pheezez.web3.eth, txHash)
        if (!status) {
          console.log("Queue transaction failed.")
          return false
        }
        return true
      })
}

export const cancelProposal = async (pheezez, proposal, account, onTxHash ) => {
  return pheezez.contracts.gov
    .methods
    .cancel(proposal).send(
      { from: account, gas: 200000 },
      async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash('')
          console.log("Cancel error", error)
          return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(pheezez.web3.eth, txHash)
        if (!status) {
          console.log("Cancel transaction failed.")
          return false
        }
        return true
      })
}

export const executeProposal = async (pheezez, proposal, account, onTxHash) => {
  return pheezez.contracts.gov
    .methods
    .execute(proposal).send(
      { from: account, gas: 300000 },
      async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash('')
          console.log("Execute error", error)
          return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(pheezez.web3.eth, txHash)
        if (!status) {
          console.log("Execute transaction failed.")
          return false
        }
        return true
      })
}
export const vote = async (pheezez, proposal, side, account, onTxHash) => {
  return pheezez.contracts.gov
    .methods
    .castVote(proposal, side).send(
      { from: account, gas: 200000 },
      async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash('')
          console.log("Vote error", error)
          return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(pheezez.web3.eth, txHash)
        if (!status) {
          console.log("Vote transaction failed.")
          return false
        }
        return true
      })
}

const stateMap = {
  0: "Pending",
  1: "Active",
  2: "Canceled",
  3: "Defeated",
  4: "Succeeded",
  5: "Queued",
  6: "Expired",
  7: "Executed"
}

export const getProposals = async (pheezez) => {
  let BASE18 = new BigNumber(10).pow(18);

  ///Change blocks

  const tltProposals = await pheezez.contracts.gov.getPastEvents("ProposalCreated", { fromBlock: 7270000, toBlock: 'latest' }) //change

  let proposals = [];
  let tltlDescriptions = [];
  for (let i = 0; i < tltProposals.length; i++) {

    let id = tltProposals[i]["returnValues"]["id"];
    let targets = [];
    for (let j = 0; j < tltProposals[i]["returnValues"]["targets"].length; j++) {
      if (pheezez.contracts.names[tltProposals[i]["returnValues"]["targets"][j]]) {
        targets.push(pheezez.contracts.names[tltProposals[i]["returnValues"]["targets"][j]]);
      } else {
        targets.push(tltProposals[i]["returnValues"]["targets"][j]);
      }
    }

    let sigs = [];
    for (let j = 0; j < tltProposals[i]["returnValues"]["signatures"].length; j++) {
      if (pheezez.contracts.names[tltProposals[i]["returnValues"]["signatures"][j]]) {
        sigs.push(pheezez.contracts.names[tltProposals[i]["returnValues"]["signatures"][j]]);
      } else {
        sigs.push(tltProposals[i]["returnValues"]["signatures"][j]);
      }
    }

    let ins = [];
    for (let j = 0; j < tltProposals[i]["returnValues"]["calldatas"].length; j++) {
      let abi_types = tltProposals[i]["returnValues"]["signatures"][j].split("(")[1].split(")").slice(0, -1)[0].split(",");
      try {
        let result = pheezez.web3.eth.abi.decodeParameters(abi_types, tltProposals[i]["returnValues"]["calldatas"][j]);
        let fr = []
        for (let k = 0; k < result.__length__; k++) {
          fr.push(result[k.toString()]);
        }
        ins.push(fr);

      }
      catch (e) {
        ins.push(["Invalid proposal values"])
      }

    }

    let proposal = await pheezez.contracts.gov.methods.proposals(id).call();

    let fv = new BigNumber(proposal["forVotes"]).div(BASE18);
    let av = new BigNumber(proposal["againstVotes"]).div(BASE18);
    let quorum = new BigNumber(proposal["quorumatPropose"]).div(BASE18);
    let eta = new BigNumber(proposal["eta"]);



    proposals.push({
      gov: "gov",
      description: tltProposals[i]["returnValues"]["description"],
      state: stateMap[await pheezez.contracts.gov.methods.state(id).call()],
      targets: targets,
      signatures: sigs,
      inputs: ins,
      forVotes: fv.toNumber(),
      againstVotes: av.toNumber(),
      id: id,
      start: tltProposals[i]["returnValues"]["startBlock"],
      end: tltProposals[i]["returnValues"]["endBlock"],
      hash: tltProposals[i]["transactionHash"],
      quorumatPropose: quorum.toNumber(),
      eta: eta.toNumber(),
    });
  }

  // proposals[1].state = "Active"
  // proposals[0].state = "Active"
  return proposals;
}
export const getThreshold = async (pheezez) => {
  let BASE18 = new BigNumber(10).pow(18);
  return new BigNumber(await pheezez.contracts.gov.methods.proposalThreshold().call()).dividedBy(BASE18).toNumber()
}

//change block implementation.
export const obtainPriorVotes = async (pheezez, account, block) => {
  let BASE18 = new BigNumber(10).pow(18);
  return new BigNumber(await pheezez.contracts.pheezez.methods.getPriorVotes(account, block).call()).dividedBy(BASE18).toNumber()
}

export const latestProposal = async (pheezez, account) => {
  return await pheezez.contracts.gov.methods.latestProposalIds(account).call()
}

export const proposalEnd = async (block) => {
  const response = await fetch(`https://api.etherscan.io/api?module=block&action=getblockcountdown&blockno=${block}&apikey=6STBMXJ1868UD2EFQYMTK6DNFH24PVB74K`);
  const myJson = await response.json(); //extract JSON from the http response
  console.log(myJson.result.EstimateTimeInSec)
  return myJson.result.EstimateTimeInSec
  // do something with myJson
}
export const getVotingPowers = async (pheezez, proposals, account) => {
  let BASE18 = new BigNumber(10).pow(18);
  let powers = []
  for (let i = 0; i < proposals.length; i++) {
    if (proposals[i].gov === "gov") {
      let receipt = await
        pheezez.contracts.gov.methods.getReceipt(proposals[i].id, account).call();
      let power = new BigNumber(receipt[2]).div(BASE18).toNumber();
      if (power === 0) {
        power = new BigNumber(await
          pheezez.contracts.pheezez.methods.getPriorVotes(account, proposals[i].start).call()
        ).div(BASE18).toNumber();
      }
      powers.push({
        hash: proposals[i].hash,
        power: power,
        voted: receipt[0],
        side: receipt[1]
      })
    }
  }
  return powers;
}

export const getCurrentVotingPower = async (pheezez, account) => {
  let BASE18 = new BigNumber(10).pow(18);
  return new BigNumber(await pheezez.contracts.pheezez.methods.getCurrentVotes(account).call()).dividedBy(BASE18).toNumber()
}

export const getVotes = async (pheezez) => {
  let BASE18 = new BigNumber(10).pow(18);
  const votesRaw = new BigNumber(await pheezez.contracts.pheezez.methods.votesAvailable().call()).dividedBy(BASE18).toNumber()
  return votesRaw
}
