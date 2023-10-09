const { expect } = require('chai')
const { ethers } = require('hardhat')

const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
// const { waffle } = require('hardhat')

describe('Funix Pricing Chain', function () {
  async function deployContractFixture() {
    const [admin] = await ethers.getSigners()
    const Main = await ethers.getContractFactory('Main')
    const contract = await Main.deploy()

    return {
      admin,
      contract,
    }
  }
  describe('Deployment', function () {
    it('Should set the right admin', async function () {
      const { admin, contract } = await loadFixture(deployContractFixture)
      const contractOwner = await contract.admin()
      expect(contractOwner).to.equal(admin.address)
    })
  })
})
