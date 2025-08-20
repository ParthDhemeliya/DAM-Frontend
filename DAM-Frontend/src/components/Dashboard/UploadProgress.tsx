import { XMarkIcon } from '@heroicons/react/24/outline'

interface UploadProgressProps {
  totalFiles: number
  uploadedFiles: number
  currentFile?: string
  percentage?: number
  onCancel?: () => void
}

export default function UploadProgress({
  totalFiles,
  uploadedFiles,
  currentFile,
  percentage = 0,
  onCancel,
}: UploadProgressProps) {
  const progress =
    percentage || (totalFiles > 0 ? (uploadedFiles / totalFiles) * 100 : 0)
  const remainingFiles = totalFiles - uploadedFiles

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-red-600" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Uploading Files
          </h3>
          <p className="text-gray-600">
            Please wait while your files are being processed
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {uploadedFiles} / {totalFiles}
            </div>
            <div className="text-sm text-gray-600">
              {remainingFiles === 0
                ? 'All files uploaded!'
                : `${remainingFiles} files remaining`}
            </div>
          </div>

          {currentFile && (
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">
                    Currently uploading: {currentFile}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-lg font-bold text-green-700">
                {uploadedFiles}
              </div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3">
              <div className="text-lg font-bold text-yellow-700">
                {remainingFiles}
              </div>
              <div className="text-xs text-yellow-600">Remaining</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {remainingFiles === 0
              ? 'Finalizing upload...'
              : 'Files are being processed securely'}
          </p>
        </div>
      </div>
    </div>
  )
}
