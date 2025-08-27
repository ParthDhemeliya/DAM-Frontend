import { FeaturesGrid, Footer, SimpleUpload } from '../components/Dashboard'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Action Section - Enhanced */}
        <div className="text-center">
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8 leading-tight tracking-tight">
              Manage Digital Assets
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              View, organize, and manage your digital files on your fingertips
            </p>
          </div>

          {/* File Upload Component */}
          <div className="mb-16">
            <SimpleUpload />
          </div>

          {/* Features Grid with Better Spacing */}
          <div className="mb-12">
            <FeaturesGrid />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
