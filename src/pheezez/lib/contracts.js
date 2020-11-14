import BigNumber from 'bignumber.js/bignumber'
import ERC20Abi from './abi/erc20.json'
import DigesterAbi from './abi/digester.json'
import PheezezAbi from './abi/pheezez.json'
import UNIV2PairAbi from './abi/uni_v2_lp.json'
import WETHAbi from './abi/weth.json'
import GOVAbi from  './abi/gov.json'
import UNIFACTAbi from './abi/unifactory.json'
import frtAbi from './abi/frt.json'
import frtPoolAbi from './abi/frtpool.json'
import frtRebaserAbi from './abi/frtrebaser.json'
import frtTreasuryAbi from './abi/frttreasury.json'
import daiAbi from './abi/dai.json'


import {
  contractAddresses,
  addressMap,
  SUBTRACT_GAS_LIMIT,
  supportedPools,
  frtPools,
} from './constants.js'
import * as Types from './types.js'

export class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3
    this.defaultConfirmations = options.defaultConfirmations
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5
    this.confirmationType =
      options.confirmationType || Types.ConfirmationType.Confirmed
    this.defaultGas = options.defaultGas
    this.defaultGasPrice = options.defaultGasPrice

    this.pheezez = new this.web3.eth.Contract(PheezezAbi)
    this.digester = new this.web3.eth.Contract(DigesterAbi)
    this.weth = new this.web3.eth.Contract(WETHAbi)
    this.ethusd = new this.web3.eth.Contract(UNIV2PairAbi)
    this.pheezezeth = new this.web3.eth.Contract(UNIV2PairAbi)  //Provitional
    this.gov = new this.web3.eth.Contract(GOVAbi)
    this.unifactory = new this.web3.eth.Contract(UNIFACTAbi)
    this.frt = new this.web3.eth.Contract(frtAbi)
    this.frtPool1 = new this.web3.eth.Contract(frtPoolAbi)
    this.frtRebaser = new this.web3.eth.Contract(frtRebaserAbi)
    this.frtTreasury = new this.web3.eth.Contract(frtTreasuryAbi)
    this.dai = new this.web3.eth.Contract(daiAbi)
    this.frtdai = new this.web3.eth.Contract(UNIV2PairAbi)


    this.pools = supportedPools.map((pool) =>
      Object.assign(pool, {
        lpAddress: pool.lpAddresses[networkId],
        tokenAddress: pool.tokenAddresses[networkId],
        lpContract: new this.web3.eth.Contract(UNIV2PairAbi),
        tokenContract: new this.web3.eth.Contract(ERC20Abi),
      }),
    )

    this.frtpools = frtPools.map((frtpool) =>
    Object.assign(frtpool, {
      poolAddress: frtpool.poolAddresses[networkId],
      tokenAddress: frtpool.tokenAddresses[networkId],
      lpAddress: frtpool.lpAddresses[networkId],
      lpContract: new this.web3.eth.Contract(UNIV2PairAbi),
      frtPoolContract: new this.web3.eth.Contract(frtPoolAbi),
      tokenContract: new this.web3.eth.Contract(ERC20Abi),
    }),
    )
    this.setProvider(provider, networkId)
    this.setDefaultAccount(this.web3.eth.defaultAccount)
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider)
      if (address) contract.options.address = address
      else console.error('Contract address not found in network', networkId)
    }

    setProvider(this.pheezez, contractAddresses.pheezez[networkId])
    setProvider(this.digester, contractAddresses.digester[networkId])
    setProvider(this.weth, contractAddresses.weth[networkId])
    setProvider(this.ethusd, contractAddresses.ethusd[networkId])
    setProvider(this.pheezezeth, contractAddresses.pheezezeth[networkId])
    setProvider(this.gov, contractAddresses.gov[networkId])
    setProvider(this.unifactory, addressMap.uniswapFactoryV2)
    setProvider(this.frt, contractAddresses.frt[networkId])
    setProvider(this.frtPool1, contractAddresses.frtPool1[networkId])
    setProvider(this.frtRebaser, contractAddresses.frtRebaser[networkId])
    setProvider(this.frtTreasury, contractAddresses.frtTreasury[networkId])
    setProvider(this.dai, contractAddresses.dai[networkId])
    setProvider(this.frtdai, contractAddresses.frtdai[networkId])


    this.pools.forEach(
      ({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
        setProvider(lpContract, lpAddress)
        setProvider(tokenContract, tokenAddress)
      },
    )

    this.frtpools.forEach(
      ({ frtPoolContract, lpContract, lpAddress, poolAddress, tokenContract, tokenAddress }) => {
        setProvider(frtPoolContract, poolAddress)
        setProvider(tokenContract, tokenAddress)
        setProvider(lpContract, lpAddress)
      },
    )
    this.names = {};
    this.names[contractAddresses.pheezez[networkId]] = "PHEEZEZ Token";
    this.names[contractAddresses.digester[networkId]] = "Digester";
    this.names[contractAddresses.timelock[networkId]] = "Timelock";
    this.names[contractAddresses.gov[networkId]] = "Governor";
  }

  setDefaultAccount(account) {
    this.pheezez.options.from = account
    this.digester.options.from = account
    this.frt.options.from = account
    this.frtPool1.options.from = account
  }

  async callContractFunction(method, options) {
    const {
      confirmations,
      confirmationType,
      autoGasMultiplier,
      ...txOptions
    } = options

    if (!this.blockGasLimit) {
      await this.setGasLimit()
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate
      if (
        this.defaultGas &&
        confirmationType !== Types.ConfirmationType.Simulate
      ) {
        txOptions.gas = this.defaultGas
      } else {
        try {
          console.log('estimating gas')
          gasEstimate = await method.estimateGas(txOptions)
        } catch (error) {
          const data = method.encodeABI()
          const { from, value } = options
          const to = method._parent._address
          error.transactionData = { from, value, data, to }
          throw error
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier
        const totalGas = Math.floor(gasEstimate * multiplier)
        txOptions.gas =
          totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas
        return { gasEstimate, g }
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0)
    } else {
      txOptions.value = '0'
    }

    const promi = method.send(txOptions)

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    }

    let hashOutcome = OUTCOMES.INITIAL
    let confirmationOutcome = OUTCOMES.INITIAL

    const t =
      confirmationType !== undefined ? confirmationType : this.confirmationType

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`)
    }

    let hashPromise
    let confirmationPromise

    if (
      t === Types.ConfirmationType.Hash ||
      t === Types.ConfirmationType.Both
    ) {
      hashPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        promi.on('transactionHash', (txHash) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.RESOLVED
            resolve(txHash)
            if (t !== Types.ConfirmationType.Both) {
              const anyPromi = promi
              anyPromi.off()
            }
          }
        })
      })
    }

    if (
      t === Types.ConfirmationType.Confirmed ||
      t === Types.ConfirmationType.Both
    ) {
      confirmationPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (
            (t === Types.ConfirmationType.Confirmed ||
              hashOutcome === OUTCOMES.RESOLVED) &&
            confirmationOutcome === OUTCOMES.INITIAL
          ) {
            confirmationOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        const desiredConf = confirmations || this.defaultConfirmations
        if (desiredConf) {
          promi.on('confirmation', (confNumber, receipt) => {
            if (confNumber >= desiredConf) {
              if (confirmationOutcome === OUTCOMES.INITIAL) {
                confirmationOutcome = OUTCOMES.RESOLVED
                resolve(receipt)
                const anyPromi = promi
                anyPromi.off()
              }
            }
          })
        } else {
          promi.on('receipt', (receipt) => {
            confirmationOutcome = OUTCOMES.RESOLVED
            resolve(receipt)
            const anyPromi = promi
            anyPromi.off()
          })
        }
      })
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise
      if (this.notifier) {
        this.notifier.hash(transactionHash)
      }
      return { transactionHash }
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise
    }

    const transactionHash = await hashPromise
    if (this.notifier) {
      this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    }
  }

  async callConstantContractFunction(method, options) {
    const m2 = method
    const { blockNumber, ...txOptions } = options
    return m2.call(txOptions, blockNumber)
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest')
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT
  }
}
