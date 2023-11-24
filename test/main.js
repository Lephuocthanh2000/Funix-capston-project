const { expect } = require('chai')
const { ethers } = require('hardhat')

const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
describe('Funix Pricing Chain: Main Contract', () => {
  async function deployContractFixture() {
    const [_admin, account_1, account_2, account_3] = await ethers.getSigners()
    const mainContract = await ethers.getContractFactory('Main')
    const contract = await mainContract.deploy()

    return {
      _admin,
      account_1,
      account_2,
      account_3,
      contract,
    }
  }
  let admin, participant1, participant2, participant3, mainContractInstance
  before(async () => {
    const { _admin, account_1, account_2, account_3, contract } =
      await loadFixture(deployContractFixture)
    admin = _admin
    participant1 = account_1
    participant2 = account_2
    participant3 = account_3
    mainContractInstance = contract
  })
  describe('Main Contract Deployment', function () {
    it('should deploy Main contract', async () => {
      expect(mainContractInstance.address).to.not.equal(0)
    })
    it('should set the admin correctly', async function () {
      const contractOwner = await mainContractInstance.admin()
      expect(contractOwner).to.equal(admin.address)
    })
  })
  describe('Participant Funix Pricing Chain', function () {
    describe('Register', function () {
      const _fullName = 'Le Phuoc Thanh'
      const _email = 'Lephuocthanh@gmail.com'
      it('Should be right valid Participant ', async function () {
        await mainContractInstance
          .connect(participant1)
          .register(_fullName, _email)

        await expect(
          mainContractInstance.connect(participant1).register(_fullName, _email)
        ).to.be.revertedWith('Participant has already registered')
      })
      it('should be right information registration of participants', async function () {
        const { fullName, email } = await mainContractInstance
          .connect(participant1)
          .getParticipant()
        expect(_fullName, _email).to.be.equal(fullName, email)
      })
      it('Must be fill in information of participants', async function () {
        const _name = ''
        expect(
          mainContractInstance.connect(participant2).register(_name, _email)
        ).to.be.revertedWith(
          'Please fill in both your full name and email address'
        )
      })
      it('should register successfully', async function () {
        expect(
          await mainContractInstance.connect(participant1).checkRegistered()
        ).to.be.equal(participant1.address)
      })
    })
    describe(' Information Participant', function () {
      it('Only valid Participant can be get info of participant', async () => {
        await expect(
          mainContractInstance.connect(participant3).getParticipant()
        ).to.be.revertedWith('Not registered')
      })

      it('Only allow admin get list participantKeys ', async () => {
        await expect(mainContractInstance.connect(admin).getListParticipants())
          .not.to.be.reverted
      })
    })
    describe('Session', function () {
      const _productName = 'laptop'
      const _productDescription = 'this is laptop'
      const _productImg = ['lap1.img', 'lap2.img', 'lap3.img']
      const _sessionDuration = 10
      it('allow admin create a session', async function () {
        await expect(
          mainContractInstance
            .connect(participant3)
            .createNewSession(
              _productName,
              _productDescription,
              _productImg,
              _sessionDuration
            )
        ).to.be.revertedWith('Must be Admin can be action')
      })
      it('check session exits', async function () {
        await mainContractInstance
          .connect(admin)
          .createNewSession(
            _productName,
            _productDescription,
            _productImg,
            _sessionDuration
          )
        const addressSession = await mainContractInstance.getAddressSession(0)
        expect(
          await mainContractInstance.getIsSession(addressSession)
        ).to.be.equal(true)
      })
    })
  })
})
