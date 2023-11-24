import { Link } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import {
  loadContractWithProvider,
  toStringState,
  checkIsRegistered,
} from '../../helper'
import styles from './Sessions.module.css'
import { MAIN_CONTRACT_ADDRESS } from '../../constants'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'
import no_image from '../../resources/images/No_image_available.png'
import SessionState from './SessionState'
import { isAdmin as checkAdmin } from '../../helper'
import { useMetaMask } from '../../context/useMetaMask.tsx'
const Sessions = () => {
  const navigate = useNavigate()
  const { wallet, isConnecting } = useMetaMask()
  const [sessions, setSessions] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  const isConnected = Boolean(wallet.accounts[0]) && isConnecting

  useEffect(() => {
    const getIsAdmin = async () => {
      if (isConnecting) return await checkAdmin()
    }
    const getSessions = async () => {
      let contract = await loadContractWithProvider(MAIN_CONTRACT_ADDRESS)
      try {
        let _sessions = await contract.getSessions()

        return _sessions
      } catch (error) {
        console.log('Error: ', error)
      }
    }
    if (isConnected) {
      getIsAdmin().then((_isAdmin) => {
        setIsAdmin(_isAdmin)
      })
    }
    if (isConnected && !isAdmin) {
      checkIsRegistered().then((result) => {
        if (!result) {
          M.toast({
            html: 'Need to register. Redirect to Register ...',
            classes: 'rounded',
          })
          setTimeout(() => {
            navigate('/register', { state: { from: 'sessions' } })
          }, 4000)
        }
      })
    }
    if (isConnecting && isConnected === true) {
      getSessions().then((_sessions) => {
        setSessions(_sessions)
      })

      console.log(sessions)
    }
  }, [])

  const addDefaultSrc = (ev) => {
    ev.target.src = no_image
  }

  return (
    <div className="container">
      <div className="session_header col s4">
        <h1>List of Session</h1>
      </div>
      <div className="session-list row">
        {isConnected ? (
          sessions.map((session) => (
            <div
              className="session-preview container col s4"
              style={{ marginTop: '50px', padding: '40px' }}
              key={session.sessionAddress}
            >
              <div
                style={{
                  height: '60vh',
                  width: '40vh',
                  overflow: 'hidden',
                  border: '1px solid gray',
                  borderRadius: '30px',
                  padding: '40px',
                  boxShadow: '#f95997 0px 0px 5px',
                }}
              >
                <div className={`${styles.session_header}`}>
                  <div className={`${styles.session_icon}`}>
                    <img
                      onError={addDefaultSrc}
                      src={`https://cf-ipfs.com/ipfs/${session.productImages[0]}`}
                      alt=""
                      style={{
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        filter: 'grayscale(0)',
                      }}
                    />
                  </div>
                  <div className={`${styles.session_header_state}`}>
                    <SessionState
                      sessionAddress={session.sessionAddress}
                      sessionState={session.state}
                    />
                  </div>
                </div>
                <Link to={`/sessions/${session.sessionAddress}`}>
                  <p className={`${styles.session_name}`}>
                    {session.productName}
                  </p>
                  <p className={`${styles.session_description}`}>
                    {session.productDescription}
                  </p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div
            className="container"
            style={{
              textAlign: 'center',
              marginTop: '50px',
              overflow: 'hidden',
              border: '1px solid gray',
              borderRadius: '30px',
              padding: '40px',
              boxShadow: '#f95997 0px 0px 5px',
            }}
          >
            <h1 className="pink-text accent-1">Please connect wallet</h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sessions
