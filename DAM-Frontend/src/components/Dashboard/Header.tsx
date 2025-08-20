import { CloudArrowUpIcon as CloudArrowUpIconSolid } from '@heroicons/react/24/solid'

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-white/30 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <CloudArrowUpIconSolid className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              DAM Platform
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {/* <span className="text-gray-600 font-medium">File Upload</span> */}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Login
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
