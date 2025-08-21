import React from 'react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

interface AnalyticsChartsProps {
  fileTypeBreakdown: { [key: string]: number }
  uploadStats: any
  downloadStats: any
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  fileTypeBreakdown,
  uploadStats,
  downloadStats,
}) => {
  // Prepare data for file type breakdown chart
  const fileTypeData: ChartData = {
    labels: Object.keys(fileTypeBreakdown),
    datasets: [
      {
        label: 'File Count',
        data: Object.values(fileTypeBreakdown),
        backgroundColor: [
          '#3B82F6', // blue
          '#10B981', // green
          '#F59E0B', // yellow
          '#EF4444', // red
          '#8B5CF6', // purple
          '#06B6D4', // cyan
          '#F97316', // orange
          '#84CC16', // lime
        ],
        borderColor: [
          '#1D4ED8',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED',
          '#0891B2',
          '#EA580C',
          '#65A30D',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Prepare data for upload/download comparison
  const comparisonData: ChartData = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
      {
        label: 'Uploads',
        data: [
          uploadStats?.uploadsToday || 0,
          uploadStats?.uploadsThisWeek || 0,
          uploadStats?.uploadsThisMonth || 0,
        ],
        backgroundColor: ['rgba(59, 130, 246, 0.6)'],
        borderColor: ['rgba(59, 130, 246, 1)'],
        borderWidth: 2,
      },
      {
        label: 'Downloads',
        data: [
          downloadStats?.downloadsToday || 0,
          downloadStats?.downloadsThisWeek || 0,
          downloadStats?.downloadsThisMonth || 0,
        ],
        backgroundColor: ['rgba(16, 185, 129, 0.6)'],
        borderColor: ['rgba(16, 185, 129, 1)'],
        borderWidth: 2,
      },
    ],
  }

  // Simple bar chart component using CSS
  const SimpleBarChart: React.FC<{ data: ChartData; title: string }> = ({
    data,
    title,
  }) => {
    const maxValue = Math.max(...data.datasets[0].data)

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index]
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        data.datasets[0].backgroundColor[
                          index % data.datasets[0].backgroundColor.length
                        ],
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Comparison chart component
  const ComparisonChart: React.FC<{ data: ChartData; title: string }> = ({
    data,
    title,
  }) => {
    const maxValue = Math.max(
      ...data.datasets.flatMap((dataset) => dataset.data)
    )

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {data.labels.map((label, labelIndex) => (
            <div key={label} className="space-y-2">
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="flex space-x-2">
                {data.datasets.map((dataset, datasetIndex) => {
                  const value = dataset.data[labelIndex]
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

                  return (
                    <div key={datasetIndex} className="flex-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{dataset.label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: dataset.backgroundColor[0],
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Activity timeline component
  const ActivityTimeline: React.FC = () => {
    const activities = [
      { time: '9:00 AM', activity: 'System backup completed', type: 'success' },
      { time: '10:30 AM', activity: 'New assets uploaded', type: 'info' },
      {
        time: '2:15 PM',
        activity: 'Asset processing completed',
        type: 'success',
      },
      {
        time: '4:45 PM',
        activity: 'Daily analytics report generated',
        type: 'info',
      },
      {
        time: '6:00 PM',
        activity: 'Storage optimization completed',
        type: 'success',
      },
    ]

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity Timeline
        </h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.activity}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <SimpleBarChart data={fileTypeData} title="File Type Distribution" />
      <ComparisonChart
        data={comparisonData}
        title="Upload vs Download Activity"
      />
      <ActivityTimeline />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Average File Size</span>
            <span className="font-semibold text-gray-900">
              {uploadStats?.averageFileSize || '0 B'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Total Storage Used</span>
            <span className="font-semibold text-gray-900">Calculating...</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">System Health</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Excellent
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
