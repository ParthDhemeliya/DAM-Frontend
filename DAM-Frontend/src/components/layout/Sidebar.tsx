import { setupPreloading } from '../../utils/preload'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  // Debug logging

  // Setup preloading when sidebar opens
  React.useEffect(() => {
    if (open) {
      setupPreloading()
    }
  }, [open])

  const location = useLocation()

  if (!open) return null

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Analytics', path: '/analytics' },
  ]

  return (
    <div className="fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <nav className="mt-8">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : ''
                }`}
                onClick={onClose}
              >
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
