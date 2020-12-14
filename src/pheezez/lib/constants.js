import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000
export const stakingStartTime =1  //****Modify */
export const proposalStartTime =1   //****Modify */
export const rebaseStartTime = 1606266000
export const frtFarmStartTime = 1606438800
export const rebaseCounter = 3600
export const REBASE_PERIOD = 600 


const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const addressMap = {
  uniswapFactoryV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  WETH: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  FRT: '0x2387A407Cfe62B5f8520FeA7DB0CB710Dc119f8E',
}


////Change the numbers of the NETWORK IDSSSSS
////
export const contractAddresses = {
  pheezez: {
    4: '0xbfa8b98f4b7a762d689435237d91f6c4c9ef5990',
  },
  digester: {
    4: '0xEfFDA75624EF1c282b333B38847cc2D0544B596E',
  },
  weth: {
    4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  },
  ethusd: {
    4: '0x5308a481B2b65F6086083D2268acb73AADC757E0',
  },
  pheezezeth: {
    4: '0xd524546f03068762a018E20082F971bd28570040',
  },
  gov: {
    4: '0x43753c156c0CE4e586c43024780eC34d0cd2EF28',
  },
  timelock: {
    4: '0x8CdC1CCfD0b1de8d2E7F14B69503d0aEd7bfd431',
  },
  frt: {
    4: '0x2387A407Cfe62B5f8520FeA7DB0CB710Dc119f8E',
  },
  frtRebaser: {
    4: '0x7a6a99B219704F53A51e31F8C442eeB6F4a1560E',
  },
  frtTreasury: {
    4: '0xe33C8a6cD48423cCe8DF949dC0265E50AaA358ed',
  },
  frtPool1: {
    4: '0x86039396BdE9502e5D36F5a764599fe021ce7b4B',
  },
  dai: {
    4: '0xC2CA1777CC7795DbE1843bE7Cfd03B597Ce731EC',
  },
  frtdai: {
    4: '0xAb42ef13f29FdAB9E9986E09e216b7f76563B3A2',
  },
}

/*
UNI-V2 LP Address on mainnet for reference
==========================================
0  USDT 0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852
1  USDC 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc
2  DAI  0xa478c2975ab1ea89e8196811f51a7b7ade33eb11
3  sUSD 0xf80758ab42c3b07da84053fd88804bcb6baa4b5c
4  COMP 0xcffdded873554f362ac02f8fb1f02e5ada10516f
5  LEND 0xab3f9bf1d81ddb224a2014e98b238638824bcf20
6  SNX  0x43ae24960e5534731fc831386c07755a2dc33d47
7  UMA  0x88d97d199b9ed37c29d846d00d443de980832a22
8  LINK 0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974
9  BAND 0xf421c3f2e695c2d4c0765379ccace8ade4a480d9
10 AMPL 0xc5be99a02c6857f9eac67bbce58df5572498f40c
11 YFI  0x2fdbadf3c4d5a8666bc06645b8358ab803996e28
12 SUSHI 0xce84867c3c02b05dc570d0135103d3fb9cc19433
*/


////Change the network IDSSSSS
////
export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      4: '0xff98979c95777a4657383754ad1e2890fda02824',
    },
    tokenAddresses: {
      4: '0xff98979c95777a4657383754ad1e2890fda02824',
    },
    name: 'GASU Pool',
    symbol: 'GASU',
    tokenSymbol: 'GASU',
    icon: require("../../assets/img/eos-logo.svg"),
    icon2: '',
    unipool: "",
  },
  {
    pid: 1,
    lpAddresses: {
      4: '0xd524546f03068762a018E20082F971bd28570040',
    },
    tokenAddresses: {
      4: '0xbFa8B98f4B7A762d689435237D91f6c4C9eF5990',
    },
    name: 'PHZT-ETH',
    symbol: 'PHZT-ETH LP',
    tokenSymbol: 'PHZT',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/eth-logo.svg"),
    unipool: "https://app.uniswap.org/#/add/0xbFa8B98f4B7A762d689435237D91f6c4C9eF5990/ETH",
  },
  {
    pid: 2,
    lpAddresses: {
      4: '0xc2ca1777cc7795dbe1843be7cfd03b597ce731ec',
    },
    tokenAddresses: {
      4: '0xc2ca1777cc7795dbe1843be7cfd03b597ce731ec',
    },
    name: 'QLO Pool',
    symbol: 'QLO',
    tokenSymbol: 'QLO',
    icon: require("../../assets/img/sushi-logo.png"),
    icon2: '',
    unipool: "",
  },
  
]

//Pools related to FRT

export const frtPools = [
  {
    pid: 0,
    poolAddresses: {
      4: '0x86039396BdE9502e5D36F5a764599fe021ce7b4B',
    },
    lpAddresses: {
      4: '0xAb42ef13f29FdAB9E9986E09e216b7f76563B3A2',
    },
    tokenAddresses: {
      4: '0xC2CA1777CC7795DbE1843bE7Cfd03B597Ce731EC',
    },
    name: 'FRT-DAI Pool',
    symbol: 'FRT-DAI',
    tokenSymbol: 'FRTLP',
    icon: require("../../assets/img/LogoFRT.png"),
    icon2: require("../../assets/img/dai-logo.svg"),
    unipool: "https://app.uniswap.org/#/add/0x2387A407Cfe62B5f8520FeA7DB0CB710Dc119f8E/0xC2CA1777CC7795DbE1843bE7Cfd03B597Ce731EC",
    starttime: 1606438800,
  },
  {
    pid: 1,
    poolAddresses: {
      4: '0xbA759c288bE07f0E966C14bE2ad7b6D3dC14825D',
    },
    lpAddresses: {
      4: '0xd524546f03068762a018E20082F971bd28570040',
    },
    tokenAddresses: {
      4: '0xbFa8B98f4B7A762d689435237D91f6c4C9eF5990',
    },
    name: 'PHZT-ETH Pool',
    symbol: 'PHZT-ETH',
    tokenSymbol: 'PHZTLP',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/eth-logo.svg"),
    unipool: "https://app.uniswap.org/#/add/0xbFa8B98f4B7A762d689435237D91f6c4C9eF5990/ETH",
    starttime: 1606525200,
  },
  {
    pid: 2,
    poolAddresses: {
      4: '0x859e7D7b0558540Aed53d48a6Ee3D82A867Be18a',
    },
    lpAddresses: {
      4: '0xbFa8B98f4B7A762d689435237D91f6c4C9eF5990',
    },
    tokenAddresses: {
      4: '0xbFa8B98f4B7A762d689435237D91f6c4C9eF5990',
    },
    name: 'PHZT Pool',
    symbol: 'PHZT',
    tokenSymbol: 'PHZT',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: '',
    unipool: "",
    starttime: 1606611600,
  },
  
]
