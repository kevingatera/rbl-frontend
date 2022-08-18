import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import artistService from './artistService'

// Get artists from localStorage
const artists = JSON.parse(localStorage.getItem('artists'))

const initialState = {
  currentArtist: null,
  artists: artists || [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get artists
export const getArtists = createAsyncThunk(
  'artists/getAll',
  async (artist, thunkAPI) => {
    try {
      return await artistService.fetchArtists()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

export const persistArtistRate = createAsyncThunk(
  'artists/changeRate',
  async ({ artistId, newRate }, thunkAPI) => {
    try {
      return await artistService.changeRateArtist(artistId, newRate)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

export const payoutArtist = createAsyncThunk(
  'artists/payout',
  async (artistId, thunkAPI) => {
    try {
      return await artistService.payoutArtist(artistId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

export const artistSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArtists.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getArtists.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.artists = action.payload
        state.currentArtist = null
      })
      .addCase(getArtists.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.payload
        state.artists = []
        state.currentArtist = null
      })
      .addCase(persistArtistRate.pending, (state) => {
        state.isLoading = true
      })
      .addCase(persistArtistRate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.message = false
        state.currentArtist = action.payload
      })
      .addCase(persistArtistRate.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.payload
        state.currentArtist = null
      })
      .addCase(payoutArtist.pending, (state) => {
        state.isLoading = true
      })
      .addCase(payoutArtist.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.message = false
        state.currentArtist = action.payload
      })
      .addCase(payoutArtist.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.payload
        state.currentArtist = null
      })
  },
})

export const { reset } = artistSlice.actions
export default artistSlice.reducer
