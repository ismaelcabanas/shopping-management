import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Navigation } from './presentation/components/Navigation'
import { HomePage } from './presentation/pages/HomePage'
import { DashboardPage } from './presentation/pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
