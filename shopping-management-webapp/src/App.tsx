import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Navigation } from './presentation/shared/components/Navigation'
import { HomePage } from './presentation/pages/HomePage'
import { DashboardPage } from './presentation/pages/DashboardPage'
import { AddProductPage } from './presentation/pages/AddProductPage'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/catalog/add" element={<AddProductPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
