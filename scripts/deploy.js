const hre = require('hardhat')
const fs = require('fs')
const path = require('path')
const { ethers, artifacts } = require('hardhat')
async function main() {
  console.log('Deployment started!')
  const Main = await hre.ethers.getContractFactory('Main')
  const main = await Main.deploy()
  const [deployer] = await ethers.getSigners()
  await main.deployed()
  console.log('Account deployed to:', deployer.address)
  console.log(' deployed to Address:', main.address)
  saveContractFiles(main)
}
function saveContractFiles(contract) {
  const contractDir = path.join(__dirname, '..', 'frontend', 'src', 'contracts')

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir)
  }

  fs.writeFileSync(
    path.join(contractDir, `contract-address-${network.name}.json`),
    JSON.stringify({ MainContract: contract.address }, null, 2)
  )

  console.log('Saving artifacts to: ', contractDir)
  const MainArtifact = artifacts.readArtifactSync('Main')
  fs.writeFileSync(
    path.join(contractDir, 'Main.json'),
    JSON.stringify(MainArtifact, null, 2)
  )

  const SessionArtifact = artifacts.readArtifactSync('Session')

  fs.writeFileSync(
    path.join(contractDir, 'Session.json'),
    JSON.stringify(SessionArtifact, null, 2)
  )
}
main().catch((error) => {
  console.log(error)
  process.exitCode = 1
})
