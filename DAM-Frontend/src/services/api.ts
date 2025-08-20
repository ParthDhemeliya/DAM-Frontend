const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

interface UploadSummary {
  uploaded: number
  replaced: number
  skipped: number
}

interface AssetData {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  category: string
  created_at: string
  updated_at: string
}

export interface UploadResponse {
  success: boolean
  data: AssetData | AssetData[]
  message: string
  summary: UploadSummary
  count?: number
}

export const uploadAssets = async (
  files: File[],
  onProgress?: (progress: {
    currentFile: string
    fileIndex: number
    totalFiles: number
  }) => void
): Promise<UploadResponse> => {
  try {
    const totalFiles = files.length
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    if (onProgress && files.length > 0) {
      onProgress({
        currentFile: files[0].name,
        fileIndex: 0,
        totalFiles,
      })
    }

    const response = await fetch(`${API_BASE_URL}/assets/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      let errorMessage = 'Upload failed'
      try {
        const errorData = await response.json()
        errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error occurred during upload')
  }
}

export const uploadAssetsWithProgress = async (
  files: File[],
  onProgress?: (progress: {
    currentFile: string
    fileIndex: number
    totalFiles: number
    bytesUploaded: number
    totalBytes: number
    percentage: number
  }) => void
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    const totalFiles = files.length

    files.forEach((file) => {
      formData.append('files', file)
    })

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentage = Math.round((event.loaded / event.total) * 100)
        const estimatedFileIndex = Math.floor(
          (event.loaded / event.total) * totalFiles
        )
        const currentFileIndex = Math.min(estimatedFileIndex, totalFiles - 1)
        const currentFile =
          files[currentFileIndex]?.name || files[0]?.name || 'Unknown'

        onProgress({
          currentFile,
          fileIndex: currentFileIndex,
          totalFiles,
          bytesUploaded: event.loaded,
          totalBytes: event.total,
          percentage,
        })
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        } catch (error) {
          reject(new Error('Failed to parse response'))
        }
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred'))
    })

    xhr.open('POST', `${API_BASE_URL}/assets/upload`)
    xhr.send(formData)
  })
}

export const getAssets = async () => {
  const response = await fetch(`${API_BASE_URL}/assets`)

  if (!response.ok) {
    throw new Error('Failed to fetch assets')
  }

  return response.json()
}
