import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from './components/common/ToastContainer'

function App() {
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('Environment variables:', import.meta.env)

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </Provider>
  )
}

export default App
