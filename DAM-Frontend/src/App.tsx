import { useState } from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import { ToastContainer } from './components/common/ToastContainer'
import { routes } from './routes'

// AppRoutes component to use the route configuration
function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 ">
          <Header onMenuClick={toggleSidebar} />
          <Sidebar open={sidebarOpen} onClose={closeSidebar} />

          <main
            className={`transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-0'
            }`}
          >
            <AppRoutes />
          </main>
          <ToastContainer />
        </div>
      </Router>
    </Provider>
  )
}

export default App
