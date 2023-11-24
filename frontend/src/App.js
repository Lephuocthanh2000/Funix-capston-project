import NavBar from './NavBar'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Sessions from './pages/sessions/Sessions'
import AccountDetail from './pages/account_detail/AccountDetail'
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SessionDetail from './pages/session_detail/SessionDetail'
import Accounts from './pages/accounts/Accounts'
import Home from './pages/home/home'
import { ethers } from 'ethers'
import CreateNewSession from './pages/create_new_session/CreateNewSession'
import SessionsList from './pages/SessionsList/SessionsList'
import { sessionsCtx, SessionContext } from './context/SessionContext'
import { useContext, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { isAdmin as checkAdmin } from './helper'
import { MetaMaskContextProvider } from './context/useMetaMask.tsx'
function App() {
  return (
    <BrowserRouter>
      <MetaMaskContextProvider>
        <div className="App">
          <nav>
            <NavBar />
          </nav>
          <Routes>
            <Route path="/" element={<Navigate to={'/home'} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/sessions/:address" element={<SessionDetail />} />
            <Route path="/create-session" element={<CreateNewSession />} />
            <Route path="/sessionsList" element={<SessionsList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accountsList" element={<Accounts />} />
            <Route path="/accounts/:address" element={<AccountDetail />} />
          </Routes>
        </div>
      </MetaMaskContextProvider>
    </BrowserRouter>
  )
}

export default App
