import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000
export const stakingStartTime =1601866920   //****Modify */
export const proposalStartTime =1602734905   //****Modify */

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
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}


////Change network Id numbers when needed
////
export const contractAddresses = {
  pheezez: {
    1: '0x8296BcEd40BA067a1de30aEB5a294258c16a0473',
  },
  digester: {
    1: '0xf16160dBeADe7827058D3dBc9D5628ac930f7555',
  },
  weth: {
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  ethusd: {
    1: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
  },
  pheezezeth: {
    1: '0xbA37650F1dAD444E0EE83aA4F42F7Bba2749A549',
  },
  gov: {
    1: '0x62823702F035edD42d678563C2c6af5648908A48',
  },
  timelock: {
    1: '0xb07b20EF02Fe024f4Cb2E6F48F3af96Ba2e41994',
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


////CAMBIAR LOS NUMEROS DE LAS NETWORK IDSSSSS
////
export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      1: '0xbA37650F1dAD444E0EE83aA4F42F7Bba2749A549',
    },
    tokenAddresses: {
      1: '0x8296BcEd40BA067a1de30aEB5a294258c16a0473',
    },
    name: 'PHZT-ETH',
    symbol: 'PHZT-ETH LP',
    tokenSymbol: 'PHZT',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/eth-logo.svg"),
    unipool: "https://app.uniswap.org/#/add/0x8296BcEd40BA067a1de30aEB5a294258c16a0473/ETH",
  },
  {
    pid: 1,
    lpAddresses: {
      1: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
    },
    tokenAddresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    name: 'ETH-USDT',
    symbol: 'ETH-USDT LP',
    tokenSymbol: 'USDT',
    icon: require("../../assets/img/usdt-logo.svg"),
    icon2: require("../../assets/img/eth-logo.svg"),
    unipool: "https://app.uniswap.org/#/add/0xdAC17F958D2ee523a2206206994597C13D831ec7/ETH",
  },
  {
    pid: 2,
    lpAddresses: {
      1: '0x6420e846872CfaDEfb43f8a0aca7B5A3068d381D',
    },
    tokenAddresses: {
      1: '0x1E18821E69B9FAA8e6e75DFFe54E7E25754beDa0',
    },
    name: 'PHZT-Kimchi',
    symbol: 'PHZT-Kimchi LP',
    tokenSymbol: 'KIMCHI',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/kimchi-logo.png"),
    unipool: "https://app.uniswap.org/#/add/0x1E18821E69B9FAA8e6e75DFFe54E7E25754beDa0/0x8296BcEd40BA067a1de30aEB5a294258c16a0473",
  },
  {
    pid: 3,
    lpAddresses: {
      1: '0x0868818Ca648E241A6A8CC38c77448933A8cFD11',
    },
    tokenAddresses: {
      1: '0x4b7DfAe2567181E54776337C840e142ACb42AA1F',
    },
    name: 'PHZT-GKimchi',
    symbol: 'PHZT-GKimchi LP',
    tokenSymbol: 'GODKIMCHI',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/gkimchi-logo.png"),
    unipool: "https://app.uniswap.org/#/add/0x4b7DfAe2567181E54776337C840e142ACb42AA1F/0x8296BcEd40BA067a1de30aEB5a294258c16a0473",
  },
  {
    pid: 4,
    lpAddresses: {
      1: '0x5489916B86164249BB2F9bb1579428f68f04B707',
    },
    tokenAddresses: {
      1: '0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5',
    },
    name: 'PHZT-PICKLE',
    symbol: 'PHZT-PICKLE LP',
    tokenSymbol: 'PICKLE',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/pickle-logo.png"),
    unipool: "https://app.uniswap.org/#/add/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/0x8296BcEd40BA067a1de30aEB5a294258c16a0473",
  },
  {
    pid: 5,
    lpAddresses: {
      1: '0x6Bd1b7EF4Ce45274D247D90DE356565C836F2A57',
    },
    tokenAddresses: {
      1: '0xEd0439EACf4c4965AE4613D77a5C2Efe10e5f183',
    },
    name: 'PHZT-SHROOM',
    symbol: 'PHZT-SHROOM LP',
    tokenSymbol: 'SHROOM',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/shroom-logo.png"),
    unipool: "https://app.uniswap.org/#/add/0xEd0439EACf4c4965AE4613D77a5C2Efe10e5f183/0x8296BcEd40BA067a1de30aEB5a294258c16a0473",
  },
  {
    pid: 6,
    lpAddresses: {
      1: '0x73d961fC88B8be968ff266f1F4FE6B1EcEadAc17',
    },
    tokenAddresses: {
      1: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    },
    name: 'PHZT-SUSHI',
    symbol: 'PHZT-SUSHI LP',
    tokenSymbol: 'SUSHI',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/sushi-logo.png"),
    unipool: "https://app.uniswap.org/#/add/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/0x8296BcEd40BA067a1de30aEB5a294258c16a0473",
  },
  {
    pid: 7,
    lpAddresses: {
      1: '0xFe08cE82A6968b01cc9159C92D71C0370587dd7E',
    },
    tokenAddresses: {
      1: '0x066798d9ef0833ccc719076Dab77199eCbd178b0',
    },
    name: 'PHZT-SAKE',
    symbol: 'PHZT-SAKE LP',
    tokenSymbol: 'SAKE',
    icon: require("../../assets/img/tokenLogo.svg"),
    icon2: require("../../assets/img/sake-logo.svg"),
    unipool: "https://app.uniswap.org/#/add/0x066798d9ef0833ccc719076Dab77199eCbd178b0/0x8296BcEd40BA067a1de30aEB5a294258c16a0473",
  },
]
