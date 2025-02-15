import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Signuppage from './pages/Signuppage'
import Loginpage from './pages/Loginpage'
import Navbar from './components/Navbar'
import Adminpage from './pages/Adminpage'

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/dashboard" element={<Adminpage />} />
      </Routes>
    </>
  )
}

export default App
