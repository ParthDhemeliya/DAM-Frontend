import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  CloudArrowUpIcon,
  PhotoIcon,
  FilmIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch } from '../../store/hooks'
import { addFiles } from '../../store/slices/uploadSlice'
import { fileRegistry } from '../../utils/fileRegistry'
import { useToast } from '../../hooks/useToast'

interface FileUploadAreaProps {
  onFileSelect: (files: File[]) => void
}

export default function FileUploadArea({ onFileSelect }: FileUploadAreaProps) {
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showSuccess, showError } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Validate files before adding
      const maxSize = 100 * 1024 * 1024 // 100MB
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/']

      const validFiles: File[] = []
      const errors: string[] = []

      acceptedFiles.forEach((file) => {
        if (file.size > maxSize) {
          errors.push(`File ${file.name} is too large (max 100MB)`)
        } else if (!allowedTypes.some((type) => file.type.startsWith(type))) {
          errors.push(`File ${file.name} has unsupported type: ${file.type}`)
        } else {
          validFiles.push(file)
        }
      })

      // Show errors if any
      if (errors.length > 0) {
        errors.forEach((error) => showError(error))
      }

      // Only add valid files
      if (validFiles.length > 0) {
        const filesWithPreview = validFiles.map((file) => {
          const id = `${file.name}-${Date.now()}`
          // Store File object in registry
          fileRegistry.set(id, file)

          return {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            preview: file.type.startsWith('image/')
              ? URL.createObjectURL(file)
              : undefined,
          }
        })

        dispatch(addFiles(filesWithPreview))
        onFileSelect(validFiles)

        // Show success message
        if (validFiles.length === 1) {
          showSuccess(`${validFiles.length} file added successfully`)
        } else {
          showSuccess(`${validFiles.length} files added successfully`)
        }
      }
    },
    [dispatch, onFileSelect, showSuccess, showError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/plain': ['.txt'],
    },
    multiple: true,
  })

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative group transition-all duration-300 transform hover:scale-[1.02] ${
          isDragActive
            ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 scale-105 shadow-2xl'
            : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-2xl'
        } border-2 border-dashed rounded-3xl p-8 cursor-pointer shadow-lg`}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files || [])
            if (selectedFiles.length > 0) {
              onDrop(selectedFiles)
            }
          }}
          className="hidden"
        />

        {/* Background Pattern */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1)_0%,transparent_50%)]"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 ${
                isDragActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg scale-110'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100'
              }`}
            >
              <CloudArrowUpIcon
                className={`w-12 h-12 transition-all duration-300 ${
                  isDragActive
                    ? 'text-white scale-110'
                    : 'text-gray-400 group-hover:text-blue-500'
                }`}
              />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300">
            {isDragActive ? 'Drop files here!' : 'Drag and drop files here'}
          </h3>

          <p className="text-gray-600 mb-4 text-base">
            or{' '}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-4 hover:decoration-blue-400 transition-all duration-200"
            >
              browse files
            </button>
          </p>

          {/* File Type Icons */}
          <div className="flex justify-center space-x-6 mb-4">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                <PhotoIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Images</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <FilmIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Videos</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Documents
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full inline-block">
            Supports: Images, Videos, PDFs, Documents, Spreadsheets, Text files
          </p>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  )
}
