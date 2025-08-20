import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface UploadSummaryProps {
  summary: {
    uploaded: number
    replaced: number
    skipped: number
    details: {
      uploaded: string[]
      replaced: string[]
      skipped: string[]
    }
  }
  onClose: () => void
  onUploadMore: () => void
}

type TabType = 'overview' | 'uploaded' | 'replaced' | 'skipped'

export default function UploadSummary({
  summary,
  onClose,
  onUploadMore,
}: UploadSummaryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const total = summary.uploaded + summary.replaced + summary.skipped

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      count: total,
      icon: CheckCircleIcon,
      color: 'text-gray-600',
    },
    {
      id: 'uploaded',
      label: 'Uploaded',
      count: summary.uploaded,
      icon: CheckCircleIcon,
      color: 'text-green-600',
    },
    {
      id: 'replaced',
      label: 'Replaced',
      count: summary.replaced,
      icon: InformationCircleIcon,
      color: 'text-blue-600',
    },
    {
      id: 'skipped',
      label: 'Skipped',
      count: summary.skipped,
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
    },
  ]

  const renderFileList = (
    files: string[],
    type?: 'uploaded' | 'replaced' | 'skipped'
  ) => (
    <div className="max-h-64 overflow-y-auto">
      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No files in this category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((filename, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  type === 'uploaded'
                    ? 'bg-green-500'
                    : type === 'replaced'
                    ? 'bg-blue-500'
                    : type === 'skipped'
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
                }`}
              ></div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm text-gray-700 font-medium truncate block"
                  title={filename}
                >
                  {filename}
                </span>
                {type === 'skipped' && (
                  <span className="text-xs text-yellow-600 italic">
                    File already exists in database
                  </span>
                )}
                {type === 'replaced' && (
                  <span className="text-xs text-blue-600 italic">
                    File was updated with new version
                  </span>
                )}
                {type === 'uploaded' && (
                  <span className="text-xs text-green-600 italic">
                    Successfully uploaded new file
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div
                className="bg-green-50 rounded-xl p-3 text-center cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => setActiveTab('uploaded')}
              >
                <div className="flex items-center justify-center mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-xl font-bold text-green-700">
                  {summary.uploaded}
                </div>
                <div className="text-xs text-green-600">Uploaded</div>
              </div>

              <div
                className="bg-blue-50 rounded-xl p-3 text-center cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => setActiveTab('replaced')}
              >
                <div className="flex items-center justify-center mb-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-blue-700">
                  {summary.replaced}
                </div>
                <div className="text-xs text-blue-600">Replaced</div>
              </div>

              <div
                className="bg-yellow-50 rounded-xl p-3 text-center cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={() => setActiveTab('skipped')}
              >
                <div className="flex items-center justify-center mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-xl font-bold text-yellow-700">
                  {summary.skipped}
                </div>
                <div className="text-xs text-yellow-600">Skipped</div>
                <div className="text-xs text-yellow-500 mt-1">
                  Already exist
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Click on any category to see detailed file list
            </p>
          </div>
        )

      case 'uploaded':
        return (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-green-700">
                Successfully Uploaded Files
              </h4>
            </div>
            {renderFileList(summary.details.uploaded, 'uploaded')}
          </div>
        )

      case 'replaced':
        return (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <InformationCircleIcon className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-blue-700">
                Replaced Files
              </h4>
            </div>
            {renderFileList(summary.details.replaced, 'replaced')}
          </div>
        )

      case 'skipped':
        return (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              <h4 className="text-lg font-semibold text-yellow-700">
                Skipped Files
              </h4>
              <span className="text-sm text-yellow-600 font-normal">
                (Files already exist in database)
              </span>
            </div>
            {renderFileList(summary.details.skipped, 'skipped')}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6 pt-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Complete!
          </h3>
          <p className="text-gray-600">
            Your files have been processed successfully
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${tab.color}`} />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="px-8 pb-8">{renderTabContent()}</div>

        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 rounded-b-3xl">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={onUploadMore}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Upload More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
