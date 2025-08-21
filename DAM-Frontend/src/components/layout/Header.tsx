import { Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
        onClick={onMenuClick}
        aria-label="Toggle sidebar menu"
      >
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="h-6 w-px bg-gray-200" aria-hidden="true" />

      <span className="text-lg font-semibold text-gray-900 ml-2">
        DAM Platform
      </span>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <span className="sr-only">View notifications</span>
            {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
          </button>

          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          {/* <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">U</span>
              </div>
            </button>
          </div> */}
        </div>
      </div>
    </header>
  )
}
