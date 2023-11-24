import { isAdmin as checkAdmin } from './helper'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatAddress } from './helper'
import M from 'materialize-css'

import { useMetaMask } from './context/useMetaMask.tsx'

const NavBar = () => {
  let navigate = useNavigate()
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask()
  const [isConnected, setIsConnected] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currenAddress, setCurrenAddress] = useState(null)
  const handleCreateNewSession = async () => {
    navigate('./create-session')
  }
  const getIsAdmin = async () => {
    return await checkAdmin()
  }
  useEffect(() => {
    setCurrenAddress(wallet.accounts[0])
    setIsConnected(isConnecting)
    console.log(currenAddress)
    if (isConnecting) {
      // isConnecting = true and account is exits

      getIsAdmin().then((_isAdmin) => {
        setIsAdmin(_isAdmin)
      })
      setIsConnected(isConnecting)
    } else {
      setIsAdmin(false)
    }
    console.log(isConnected)
  }, [wallet, connectMetaMask])

  const info = () => {
    var elems = document.querySelectorAll('.dropdown-trigger')

    const options = {
      inDuration: 150,
      hover: true,
    }

    var instances = M.Dropdown.init(elems, options)
  }
  // const accountsInfo = () => {
  //   ;<Link
  //     href={`https://etherscan.io/address/${wallet.accounts[0]}`}
  //     target="_blank"
  //     data-tooltip="Open in Block Explorer"
  //   ></Link>
  // }
  const disConnectMetamask = () => {
    setIsAdmin(false)
    setIsConnected(false)
    setCurrenAddress(null)
    navigate('./home')
  }
  return (
    <div>
      <nav>
        <div className="nav-wrapper  blue accent-3">
          <ul class="left hide-on-med-and-down">
            <li>
              {' '}
              <Link to={'/home'}>Home</Link>
            </li>
            <li>
              {' '}
              <Link to={'/sessions'}>Sessions</Link>
            </li>
            {isAdmin && (
              <li>
                {' '}
                <Link to={'/sessionsList'}>Sessions List</Link>
              </li>
            )}
            {isAdmin && (
              <li>
                {' '}
                <Link to={'/accountsList'}>Accounts List </Link>
              </li>
            )}
          </ul>
          <ul class="right hide-on-med-and-down">
            {isAdmin && (
              <li>
                <a
                  className="waves-effect waves-light btn-small  pink accent-3"
                  onClick={handleCreateNewSession}
                >
                  Create New Session
                </a>
              </li>
            )}
            {!hasProvider && (
              <li>
                <a
                  className="waves-effect waves-light btn-small  pink accent-3"
                  href="https://metamask.io"
                  target="_blank"
                >
                  Install MetaMask
                </a>
              </li>
            )}

            {isConnected && Boolean(currenAddress) ? (
              <li>
                <a
                  tabindex="-1"
                  className="dropdown-trigger btn waves-effect waves-light red"
                  data-target="dropdown1"
                  onMouseEnter={info}
                  // onDoubleClick={accountsInfo}
                >
                  {formatAddress(currenAddress)}
                </a>
              </li>
            ) : (
              <li>
                <button
                  className="waves-effect waves-light btn-small  pink accent-3"
                  onClick={connectMetaMask}
                >
                  Connect MetaMask
                </button>
              </li>
            )}
          </ul>
          <ul id="dropdown1" class="dropdown-content">
            <li class="divider" tabIndex="-1"></li>
            {
              <li>
                {' '}
                <Link to={`/accounts/${currenAddress}`}>Account</Link>
              </li>
            }
            {
              <li>
                <a onClick={disConnectMetamask}>Disconnect</a>
              </li>
            }
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
