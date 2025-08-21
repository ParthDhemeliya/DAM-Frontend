import { useEffect, useState } from 'react'
import { uploadFiles, clearFiles } from '../store/slices/uploadSlice'
import type { RootState } from '../store/store'
import {
  FileUploadArea,
  FileList,
  FeaturesGrid,
  Footer,
  UploadSummary,
  UploadProgress,
} from '../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useToast } from '../hooks/useToast'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const {
    files,
    uploading,
    error,
    success,
    uploadSummary,
    currentUploadFile,
    totalUploadProgress,
  } = useAppSelector((state: RootState) => state.upload)
  const { showError } = useToast()
  const [showUploadSummary, setShowUploadSummary] = useState(false)

  // Handle error notifications
  useEffect(() => {
    if (error) {
      showError(error)
    }
  }, [error, showError])

  // Handle success and show upload summary
  useEffect(() => {
    if (
      success &&
      uploadSummary &&
      (uploadSummary.uploaded > 0 ||
        uploadSummary.replaced > 0 ||
        uploadSummary.skipped > 0)
    ) {
      setShowUploadSummary(true)
    }
  }, [success, uploadSummary])

  const handleUpload = async () => {
    if (files.length > 0) {
      await dispatch(uploadFiles(files))
    }
  }

  const handleCloseUploadSummary = () => {
    setShowUploadSummary(false)
    dispatch(clearFiles())
  }

  const handleUploadMore = () => {
    setShowUploadSummary(false)
    dispatch(clearFiles())
  }

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
              Upload, organize, and manage your digital files on your fingertips
            </p>
          </div>

          {/* Centered Upload Area with Enhanced Spacing */}
          <div className="flex justify-center items-center mb-16">
            <FileUploadArea />
          </div>
        </div>

        {/* File List with Better Spacing */}
        <div className="mb-16">
          <FileList
            files={files}
            onUpload={handleUpload}
            uploading={uploading}
          />
        </div>

        {/* Features Grid with Better Spacing */}
        <div className="mb-12">
          <FeaturesGrid />
        </div>
      </main>

      <Footer />

      {/* Upload Progress Modal */}
      {uploading && (
        <UploadProgress
          totalFiles={files.length}
          uploadedFiles={Math.floor((totalUploadProgress / 100) * files.length)}
          currentFile={currentUploadFile || files[0]?.name || 'Processing...'}
          percentage={totalUploadProgress}
          onCancel={() => {
            // TODO: Implement cancel upload functionality
          }}
        />
      )}

      {/* Upload Summary Modal */}
      {showUploadSummary && uploadSummary && uploadSummary.details && (
        <UploadSummary
          summary={uploadSummary}
          onClose={handleCloseUploadSummary}
          onUploadMore={handleUploadMore}
        />
      )}
    </div>
  )
}
