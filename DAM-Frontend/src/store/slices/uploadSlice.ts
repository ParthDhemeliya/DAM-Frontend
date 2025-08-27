import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { fetchAssetsWithFilters } from './assetSlice'

// Simple file interface
interface FileItem {
  id: string
  name: string
  size: number
  type: string
  file: File // Keep this for upload but don't store in state
}

interface UploadState {
  files: Omit<FileItem, 'file'>[] // Remove file from state to avoid serialization issues
  uploading: boolean
  processing: boolean // New state for post-upload processing
  error: string | null
  success: boolean
  progress: number
}

const initialState: UploadState = {
  files: [],
  uploading: false,
  processing: false,
  error: null,
  success: false,
  progress: 0,
}

// Store for actual File objects (not in Redux state)
const filesMap = new Map<string, File>()

// Simple upload thunk - no complex retry logic or health checks
export const uploadFiles = createAsyncThunk(
  'upload/uploadFiles',
  async (fileIds: string[], { rejectWithValue, dispatch, getState }) => {
    try {
      const formData = new FormData()

      // Get File objects from Map using IDs
      fileIds.forEach((fileId) => {
        const file = filesMap.get(fileId)
        if (file) {
          formData.append('files', file)
        }
      })

      // Simple upload with progress tracking
      const response = await axios.post(
        'http://localhost:5000/api/assets/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutes
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              dispatch(setUploadProgress(percentCompleted))
            }
          },
        }
      )

      // Check if response indicates success
      if (response.status >= 200 && response.status < 300) {
        // After successful upload, refresh gallery to show latest assets
        try {
          const state: any = getState()
          const currentFilters = state.assets?.filters || {}
          const refreshFilters = {
            ...currentFilters,
            sortBy: 'created_at',
            sortOrder: 'DESC',
            page: 1,
          }
          dispatch(fetchAssetsWithFilters(refreshFilters))
        } catch (e) {}

        return response.data
      } else {
        // Handle non-2xx responses
        const errorMsg = `Server responded with status ${
          response.status
        }: ${response.data?.error || response.statusText}`
        throw new Error(errorMsg)
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Upload failed'
      )
    }
  }
)

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addFiles: (
      state,
      action: PayloadAction<
        { id: string; name: string; size: number; type: string }[]
      >
    ) => {
      const newFiles = action.payload
      state.files = [...state.files, ...newFiles]
      state.error = null
      state.success = false
    },
    addFileObjects: (
      state,
      action: PayloadAction<{ id: string; file: File }[]>
    ) => {
      // Store File objects in Map (this action doesn't update Redux state)
      action.payload.forEach(({ id, file }) => {
        filesMap.set(id, file)
      })
    },
    removeFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      filesMap.delete(fileId) // Remove from Map
      state.files = state.files.filter((file) => file.id !== fileId)
    },
    clearFiles: (state) => {
      filesMap.clear() // Clear Map
      state.files = []
      state.error = null
      state.success = false
    },
    resetUpload: (state) => {
      state.uploading = false
      state.error = null
      state.success = false
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload
      // If we reach 100%, switch to processing state
      if (action.payload === 100) {
        state.uploading = false
        state.processing = true
      }
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.uploading = true
        state.processing = false
        state.error = null
        state.success = false
        state.progress = 0
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.uploading = false
        state.processing = false
        state.success = true
        state.error = null
        state.progress = 100
        state.files = [] // Clear files after successful upload
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploading = false
        state.processing = false
        state.error = action.payload as string
        state.success = false

        if (state.progress < 100) {
          state.progress = 0
        }
      })
  },
})

export const {
  addFiles,
  addFileObjects,
  removeFile,
  clearFiles,
  resetUpload,
  setUploadProgress,
  setProcessing,
} = uploadSlice.actions
export default uploadSlice.reducer
