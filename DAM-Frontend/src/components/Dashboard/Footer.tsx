import { CloudArrowUpIcon as CloudArrowUpIconSolid } from '@heroicons/react/24/solid'

export default function Footer() {
  return (
    <footer className="border-t border-white/20 mt-16 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
              <CloudArrowUpIconSolid className="w-3 h-3 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-700">
              DAM Platform
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 - Your Digital Asset Manager
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </footer>
  )
}
