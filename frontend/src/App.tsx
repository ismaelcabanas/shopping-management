import ShoppingList from './presentation/components/ShoppingList'
import ErrorBoundary from './presentation/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ShoppingList />
    </ErrorBoundary>
  )
}

export default App
