import { Link } from 'react-router-dom'

export default function Navbar({
  isAdmin,
  isConnected,
  userAddress,
  onCreateSession,
  onDisconnectWallet,
}) {
  return (
    <div>
      <nav>
        <div className="row blue darken-2 nav-wrapper">
          <Link className="col s4 m2 l3 brand-logo left" to="/home">
            Funix
          </Link>
          <ul className="col m7 l6 menu center center-align show-on-med-and-down">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/sessions">Sessions</Link>
            </li>
            <li>
              <Link to="/sessionsList">Sessions List</Link>
            </li>
            <li>
              <Link to="/accounts">Accounts</Link>
            </li>
          </ul>
          <ul className="col s8 m3 l3 wallet right show-on-med-and-down">
            {isAdmin && isConnected ? (
              <li>
                <button
                  onClick={onCreateSession}
                  className="waves-effect waves-light btn red"
                >
                  Create New Session
                </button>
              </li>
            ) : (
              <li>
                <button className="waves-effect waves-light btn red">
                  Connect Wallet
                </button>
              </li>
            )}
            <li>
              <a
                className="dropdown-trigger btn waves-effect waves-light red"
                data-target="dropdown1"
              >
                {isAdmin ? 'Admin Actions' : userAddress}
              </a>
              {isAdmin ? (
                <ul id="dropdown1" className="dropdown-content">
                  <li>
                    <a onClick={onDisconnectWallet}>Disconnect Wallet</a>
                  </li>
                </ul>
              ) : null}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
