import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import {
  PhotoIcon as PhotoIconSolid,
  FilmIcon as FilmIconSolid,
} from '@heroicons/react/24/solid'
import { useAppDispatch } from '../../store/hooks'
import { removeFile, clearFiles } from '../../store/slices/uploadSlice'

interface File {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

interface FileListProps {
  files: File[]
  onUpload: () => void
  uploading: boolean
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return PhotoIconSolid
  if (fileType.startsWith('video/')) return FilmIconSolid
  return DocumentTextIcon
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function FileList({
  files,
  onUpload,
  uploading,
}: FileListProps) {
  const dispatch = useAppDispatch()

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId))
  }

  const handleClearFiles = () => {
    dispatch(clearFiles())
  }

  if (files.length === 0) return null

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <DocumentTextIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Selected Files ({files.length})
            </h3>
            <p className="text-sm text-gray-600">
              {files.length === 1
                ? '1 file selected'
                : `${files.length} files selected`}
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleClearFiles}
            className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-200 hover:scale-105 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Clear All
          </button>
          <button
            onClick={onUpload}
            disabled={uploading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none font-semibold"
          >
            {uploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>
                  Upload {files.length} File{files.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* File Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Total Size:</span>
              <span className="font-semibold text-gray-900">
                {formatFileSize(
                  files.reduce((total, file) => total + file.size, 0)
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">File Types:</span>
              <span className="font-semibold text-gray-900">
                {Array.from(
                  new Set(files.map((f) => f.type.split('/')[0]))
                ).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => {
          const IconComponent = getFileIcon(file.type)
          return (
            <div
              key={file.id}
              className="group bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-200 hover:border-blue-200 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {file.preview ? (
                    <div className="relative">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-xl shadow-sm"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <IconComponent className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-sm">
                      <IconComponent className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  title="Remove file"
                >
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
