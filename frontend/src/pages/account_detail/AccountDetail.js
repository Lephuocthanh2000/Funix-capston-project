import {
  validateRegister,
  loadContractWithSigner,
  checkIsRegistered,
} from '../../helper'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MAIN_CONTRACT_ADDRESS } from '../../constants'
import M from 'materialize-css'
import { useMetaMask } from '../../context/useMetaMask.tsx'
const AccountDetail = () => {
  let navigate = useNavigate()
  const { wallet } = useMetaMask()
  let isConnected = Boolean(wallet.accounts)
  // const { address } = useParams();
  const [participantDetail, setParticipantDetail] = useState({})
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isEditable, setIsEditable] = useState('')
  const [isChangeInformation, setIsChangeInformation] = useState(false)

  const getParticipantDetail = async () => {
    let contract = await loadContractWithSigner(MAIN_CONTRACT_ADDRESS)
    let _participantDetail = await contract.getParticipant()
    _participantDetail = {
      account: _participantDetail.account,
      fullName: _participantDetail.fullName,
      email: _participantDetail.email,
      numberOfJoinedSession:
        _participantDetail.numberOfJoinedSession.toString(),
      deviation: ethers.utils.formatEther(_participantDetail.deviation),
    }
    setFullName(_participantDetail.fullName)
    setEmail(_participantDetail.email)
    setParticipantDetail(_participantDetail)
  }

  const handleAccountsChanged = async () => {
    if (window.ethereum) {
      navigate(`/accounts/${wallet.accounts[0]}`)
      getParticipantDetail()
    }
  }

  const handleChangeInformation = () => {
    setIsEditable(true)
    setIsChangeInformation(true)
  }

  const handleSubmit = async () => {
    let contract = await loadContractWithSigner(MAIN_CONTRACT_ADDRESS)
    try {
      if (!validateRegister(fullName, email)) return
      let tx = await contract.updateParticipantDetail(fullName, email, {
        from: wallet.accounts[0],
      })
      tx.wait().then(() => {
        getParticipantDetail()
        setIsChangeInformation(false)
        setIsEditable(false)
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  useEffect(() => {
    if (wallet.accounts) {
      checkIsRegistered().then((result) => {
        if (!result) {
          M.toast({
            html: 'This address is not register. Redirect to register ...',
            classes: 'rounded',
          })
          setTimeout(
            () =>
              navigate(`/register`, {
                state: { from: `/accounts/${wallet.accounts[0]}` },
              }),
            2000
          )
        } else {
          getParticipantDetail()
        }
      })
    }
  }, [wallet.accounts])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  return (
    <div className="account-detail">
      {isConnected && (
        <div
          className="container"
          style={{
            border: '1px solid gray',
            borderRadius: '30px',
            padding: '20px',
            width: '50vw',
            marginTop: '50px',
            boxShadow: '#f95997 0px 0px 5px',
          }}
        >
          <table>
            <tbody>
              <tr>
                <td>Address</td>
                <td>{participantDetail.account}</td>
              </tr>
              <tr>
                <td>Fullname</td>
                {isEditable ? (
                  <td className="input-field">
                    <input
                      value={fullName}
                      id="full-name"
                      type="text"
                      className="validate"
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </td>
                ) : (
                  <td>{participantDetail.fullName}</td>
                )}
              </tr>
              <tr>
                <td>Email</td>
                {isEditable ? (
                  <td className="input-field">
                    <input
                      value={email}
                      id="email"
                      type="email"
                      className="validate"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </td>
                ) : (
                  <td>{participantDetail.email}</td>
                )}
              </tr>
              <tr>
                <td>numberOfJoinedSession</td>
                <td>{participantDetail.numberOfJoinedSession}</td>
              </tr>
              <tr>
                <td>Deviation</td>
                <td>{participantDetail.deviation}</td>
              </tr>
            </tbody>
          </table>

          <div className="section">
            {!isChangeInformation && (
              <button className="btn" onClick={handleChangeInformation}>
                Change information
              </button>
            )}
            {isChangeInformation && (
              <button className="btn" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetail
