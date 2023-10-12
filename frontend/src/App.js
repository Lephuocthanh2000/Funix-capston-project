import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './pages/home/home'
import Register from './pages/register/register'
import Login from './pages/login/login'

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Navbar />
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to={'/home'} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
