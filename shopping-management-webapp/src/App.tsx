import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { Navigation } from './presentation/shared/components/Navigation'
import { HomePage } from './presentation/pages/HomePage'
import { DashboardPage } from './presentation/pages/DashboardPage'
import { ProductCatalogPage } from './presentation/pages/ProductCatalogPage'
import { AddProductPage } from './presentation/pages/AddProductPage'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/catalog" element={<ProductCatalogPage />} />
        <Route path="/catalog/add" element={<AddProductPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
