import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  uploadAssetsWithProgress,
  type UploadResponse,
} from '../../services/api'
import { fileRegistry } from '../../utils/fileRegistry'

interface FileWithPreview {
  id: string
  name: string
  size: number
  type: string
  preview?: string
  lastModified: number
}

interface UploadState {
  files: FileWithPreview[]
  uploading: boolean
  uploadProgress: Record<string, number>
  currentUploadFile: string | null
  currentUploadIndex: number
  totalUploadProgress: number
  error: string | null
  success: boolean
  uploadSummary: {
    uploaded: number
    replaced: number
    skipped: number
    details: {
      uploaded: string[]
      replaced: string[]
      skipped: string[]
    }
  } | null
}

const initialState: UploadState = {
  files: [],
  uploading: false,
  uploadProgress: {},
  currentUploadFile: null,
  currentUploadIndex: 0,
  totalUploadProgress: 0,
  error: null,
  success: false,
  uploadSummary: {
    uploaded: 0,
    replaced: 0,
    skipped: 0,
    details: {
      uploaded: [],
      replaced: [],
      skipped: [],
    },
  },
}

export const updateUploadProgress = createAsyncThunk<
  void,
  {
    currentFile: string
    fileIndex: number
    totalFiles: number
    percentage: number
  },
  { rejectValue: string }
>('upload/updateUploadProgress', async (progress, { dispatch }) => {
  dispatch(setCurrentUploadFile(progress.currentFile))
  dispatch(setCurrentUploadIndex(progress.fileIndex))
  dispatch(setTotalUploadProgress(progress.percentage))
})

export const uploadFiles = createAsyncThunk<
  UploadResponse,
  FileWithPreview[],
  { rejectValue: string }
>(
  'upload/uploadFiles',
  async (files: FileWithPreview[], { rejectWithValue, dispatch }) => {
    try {
      const validationResult = await dispatch(validateFiles(files)).unwrap()
      if (!validationResult.valid) {
        return rejectWithValue('File validation failed')
      }

      const originalFiles = fileRegistry.getAll(files.map((f) => f.id))
      const result = await uploadAssetsWithProgress(
        originalFiles,
        (progress) => {
          dispatch(
            updateUploadProgress({
              currentFile: progress.currentFile,
              fileIndex: progress.fileIndex,
              totalFiles: progress.totalFiles,
              percentage: progress.percentage,
            })
          )
        }
      )

      return result
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed'
      return rejectWithValue(errorMessage)
    }
  }
)

export const validateFiles = createAsyncThunk<
  { valid: boolean; errors: string[] },
  FileWithPreview[],
  { rejectValue: string }
>(
  'upload/validateFiles',
  async (files: FileWithPreview[], { rejectWithValue }) => {
    try {
      const errors: string[] = []
      const maxSize = 100 * 1024 * 1024

      files.forEach((file) => {
        if (file.size > maxSize) {
          errors.push(`File ${file.name} is too large (max 100MB)`)
        }
      })

      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/']
      files.forEach((file) => {
        const isValidType = allowedTypes.some((type) =>
          file.type.startsWith(type)
        )
        if (!isValidType) {
          errors.push(`File ${file.name} has unsupported type: ${file.type}`)
        }
      })

      if (errors.length > 0) {
        return rejectWithValue(errors.join(', '))
      }

      return { valid: true, errors: [] }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Validation failed'
      return rejectWithValue(errorMessage)
    }
  }
)

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileWithPreview[]>) => {
      state.files = action.payload
      state.error = null
      state.success = false
      state.uploadSummary = {
        uploaded: 0,
        replaced: 0,
        skipped: 0,
        details: { uploaded: [], replaced: [], skipped: [] },
      }
    },
    addFiles: (state, action: PayloadAction<FileWithPreview[]>) => {
      state.files = [...state.files, ...action.payload]
      state.error = null
      state.success = false
      state.uploadSummary = {
        uploaded: 0,
        replaced: 0,
        skipped: 0,
        details: { uploaded: [], replaced: [], skipped: [] },
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.id !== action.payload)
    },
    clearFiles: (state) => {
      state.files = []
      state.error = null
      state.success = false
      state.uploadProgress = {}
      state.currentUploadFile = null
      state.currentUploadIndex = 0
      state.totalUploadProgress = 0
      state.uploadSummary = {
        uploaded: 0,
        replaced: 0,
        skipped: 0,
        details: { uploaded: [], replaced: [], skipped: [] },
      }
    },
    setUploadProgress: (
      state,
      action: PayloadAction<{ fileId: string; progress: number }>
    ) => {
      state.uploadProgress[action.payload.fileId] = action.payload.progress
    },
    resetUpload: (state) => {
      state.uploading = false
      state.error = null
      state.success = false
      state.uploadProgress = {}
      state.currentUploadFile = null
      state.currentUploadIndex = 0
      state.totalUploadProgress = 0
      state.uploadSummary = {
        uploaded: 0,
        replaced: 0,
        skipped: 0,
        details: { uploaded: [], replaced: [], skipped: [] },
      }
    },
    setCurrentUploadFile: (state, action: PayloadAction<string>) => {
      state.currentUploadFile = action.payload
    },
    setCurrentUploadIndex: (state, action: PayloadAction<number>) => {
      state.currentUploadIndex = action.payload
    },
    setTotalUploadProgress: (state, action: PayloadAction<number>) => {
      state.totalUploadProgress = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.uploading = true
        state.error = null
        state.success = false
        state.files.forEach((file) => {
          state.uploadProgress[file.id] = 0
        })
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.uploading = false
        state.success = true
        state.error = null
        state.uploadProgress = {}

        if (action.payload?.summary) {
          const uploadedCount = action.payload.summary.uploaded || 0
          const replacedCount = action.payload.summary.replaced || 0
          const skippedCount = action.payload.summary.skipped || 0

          let uploaded: string[] = []
          let replaced: string[] = []
          let skipped: string[] = []

          if (action.payload.data && Array.isArray(action.payload.data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            action.payload.data.forEach((asset: any) => {
              const fileName =
                asset.original_name || asset.filename || asset.name
              if (fileName) {
                const status =
                  asset.status || asset.upload_status || asset.result

                if (
                  status === 'uploaded' ||
                  status === 'success' ||
                  status === 'created'
                ) {
                  uploaded.push(fileName)
                } else if (
                  status === 'replaced' ||
                  status === 'duplicate' ||
                  status === 'updated'
                ) {
                  replaced.push(fileName)
                } else if (
                  status === 'skipped' ||
                  status === 'error' ||
                  status === 'failed' ||
                  status === 'exists'
                ) {
                  skipped.push(fileName)
                }
              }
            })
          }

          if (
            uploaded.length === 0 &&
            replaced.length === 0 &&
            skipped.length === 0
          ) {
            const originalFileNames = state.files.map((file) => file.name)
            const totalFiles = originalFileNames.length
            const actualUploaded = Math.min(uploadedCount, totalFiles)
            const actualReplaced = Math.min(
              replacedCount,
              Math.max(0, totalFiles - actualUploaded)
            )
            const actualSkipped = Math.min(
              skippedCount,
              Math.max(0, totalFiles - actualUploaded - actualReplaced)
            )

            uploaded = originalFileNames.slice(0, actualUploaded)
            replaced = originalFileNames.slice(
              actualUploaded,
              actualUploaded + actualReplaced
            )

            const remainingFiles = originalFileNames.slice(
              actualUploaded + actualReplaced
            )
            skipped = remainingFiles.slice(0, actualSkipped)

            if (
              skipped.length < actualSkipped &&
              remainingFiles.length > skipped.length
            ) {
              const additionalSkipped = remainingFiles.slice(
                skipped.length,
                actualSkipped
              )
              skipped = [...skipped, ...additionalSkipped]
            }
          }

          state.uploadSummary = {
            uploaded: uploadedCount,
            replaced: replacedCount,
            skipped: skippedCount,
            details: { uploaded, replaced, skipped },
          }
        }
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload || 'Upload failed'
        state.success = false
      })
      .addCase(validateFiles.pending, (state) => {
        state.error = null
      })
      .addCase(validateFiles.fulfilled, (state) => {
        state.error = null
      })
      .addCase(validateFiles.rejected, (state, action) => {
        state.error = action.payload || 'Validation failed'
      })
  },
})

export const {
  setFiles,
  addFiles,
  removeFile,
  clearFiles,
  setUploadProgress,
  resetUpload,
  setCurrentUploadFile,
  setCurrentUploadIndex,
  setTotalUploadProgress,
} = uploadSlice.actions

export default uploadSlice.reducer
