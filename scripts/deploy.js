const hre = require('hardhat')
const fs = require('fs')
const path = require('path')

async function main() {
  console.log('Deployment started!')

  const [deployer] = await ethers.getSigners()
  const address = await deployer.getAddress()

  console.log(`Deploying the contract with the account: ${address}`)

  const Main = await hre.ethers.getContractFactory('Main')
  const contractMain = await Main.deploy()

  console.log('Contract  deployed to:', contractMain.address)
  await contractMain.deployed()
  saveContractFiles(contractMain)
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
