import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  loadContractWithSigner,
  isAdmin as checkAdmin,
  toStringState,
} from '../../helper'
import styles from './Accounts.module.css'
import { MAIN_CONTRACT_ADDRESS } from '../../constants'
import { ethers } from 'ethers'
import { useMetaMask } from '../../context/useMetaMask.tsx'
const Accounts = () => {
  let navigate = useNavigate()
  const { wallet, isConnecting } = useMetaMask()
  let isConnected = Boolean(wallet) && isConnecting
  const [accountList, setAccountList] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  const getSessions = async () => {
    let contract = await loadContractWithSigner(MAIN_CONTRACT_ADDRESS)
    try {
      let _accountList = await contract.getParticipants()
      setAccountList(_accountList)
    } catch (error) {
      console.log('Error: ', error)
    }
  }
  const getIsAdmin = async () => {
    let _isAdmin = await checkAdmin()
    return _isAdmin
  }
  useEffect(() => {
    if (isConnected) {
      getIsAdmin().then((_isAdmin) => {
        setIsAdmin(_isAdmin)
        if (!_isAdmin) {
          navigate(`./${wallet.accounts[0]}`)
        }
        getSessions()
      })
    }
  }, [wallet])

  return (
    <div>
      {isAdmin && (
        <div className="account-list container">
          <table className="highlight responsive-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Name</th>
                <th>Email</th>
                <th>Number of joined session</th>
                <th>Deviation</th>
              </tr>
            </thead>
            <tbody>
              {accountList.map((account) => (
                <tr key={account.account}>
                  <td>{account.account}</td>
                  <td>{account.fullName}</td>
                  <td>{account.email}</td>
                  <td>{account.numberOfJoinedSession.toString()}</td>
                  <td>{ethers.utils.formatEther(account.deviation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
export default Accounts
