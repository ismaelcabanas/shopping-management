import { useState } from 'react'
import { ShoppingList } from '../components/ShoppingList'
import type { Product } from '../components/ShoppingList'

export function DashboardPage() {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Leche',
      price: 1.5,
      stock: 10,
      minimumStock: 5,
    },
    {
      id: '2',
      name: 'Pan',
      price: 0.8,
      stock: 3,
      minimumStock: 5,
    },
    {
      id: '3',
      name: 'Huevos',
      price: 2.5,
      stock: 0,
      minimumStock: 6,
    },
    {
      id: '4',
      name: 'Manzanas',
      price: 2.0,
      stock: 15,
      minimumStock: 8,
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard - Mis Productos
          </h1>
          <p className="text-gray-600">
            Gestiona tu inventario personal
          </p>
        </header>

        <section>
          <ShoppingList products={products} />
        </section>
      </div>
    </div>
  )
}

