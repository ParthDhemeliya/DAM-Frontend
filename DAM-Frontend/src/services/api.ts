/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConfig } from '../config/environment'

const config = getConfig()
const API_BASE_URL = config.API_BASE_URL

import type { UploadResponse } from '../interfaces'

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
    const currentFileIndex = 0

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const bytesUploaded = event.loaded
        const totalBytes = event.total
        const percentage = Math.round((bytesUploaded / totalBytes) * 100)

        onProgress({
          currentFile: files[currentFileIndex]?.name || '',
          fileIndex: currentFileIndex,
          totalFiles,
          bytesUploaded,
          totalBytes,
          percentage,
        })
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText)
          resolve(result)
        } catch {
          reject(new Error('Invalid response format'))
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred during upload'))
    })

    xhr.open('POST', `${API_BASE_URL}/assets/upload`)
    xhr.send(formData)
  })
}

export const getAssets = async (
  page: number = 1,
  limit: number = 20,
  filters?: any
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/assets?${params}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch assets')
  }
}

export const searchAssets = async (
  query: string,
  page: number = 1,
  limit: number = 20,
  filters?: any
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/assets/search?${params}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to search assets')
  }
}

export const getAssetById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch asset')
  }
}

export const deleteAsset = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to delete asset')
  }
}

export const downloadAsset = async (id: number, filename?: string) => {
  const url = `${API_BASE_URL}/assets/${id}/download`
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename || ''
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export const streamAsset = (id: number) => `${API_BASE_URL}/assets/${id}/stream`

export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getUploadStats = async (period: string = 'month') => {
  const response = await fetch(`${API_BASE_URL}/stats/uploads?period=${period}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getDownloadStats = async (period: string = 'month') => {
  const response = await fetch(
    `${API_BASE_URL}/stats/downloads?period=${period}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getLatestAssets = async (limit: number = 10) => {
  const response = await fetch(`${API_BASE_URL}/stats/latest?limit=${limit}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getPopularAssets = async (limit: number = 10) => {
  const response = await fetch(`${API_BASE_URL}/stats/popular?limit=${limit}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getRealTimeStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/realtime`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const trackAssetView = async (
  assetId: number,
  userId?: string,
  metadata?: any
) => {
  const response = await fetch(`${API_BASE_URL}/stats/track-view`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assetId, userId, metadata }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const trackAssetDownload = async (
  assetId: number,
  userId?: string,
  metadata?: any
) => {
  const response = await fetch(`${API_BASE_URL}/stats/track-download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assetId, userId, metadata }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getAssetAnalytics = async (assetId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/stats/asset/${assetId}/analytics`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getUserBehaviorAnalytics = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/stats/user/${userId}/behavior`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}
