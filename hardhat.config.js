require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
// require('hardhat-deploy')
require('dotenv').config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      chainId: 31337,
    },
  },

  namedAccounts: {
    deployer: {
      default: 1, // here this will by default take the first account as deployer
    },
    player: {
      default: 2,
    },
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  allowUnlimitedContractSize: true,
}
