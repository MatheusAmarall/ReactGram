import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import photoService from "../services/photoService"

const initialState = {
    photos: [],
    photo: {},
    error: false,
    success: false,
    loading: false,
    message: null
}

//publish user photo
export const publishPhoto = createAsyncThunk(
    "photo/publish",
    async(photo, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.publishPhoto(photo, token)

        //check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
)

//get user photos
export const getUserPhotos = createAsyncThunk(
    "photo/userphotos",
    async(id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.getUserPhotos(id, token)

        return data;
    }
)

//delete a photo
export const deletePhoto = createAsyncThunk(
    "photo/delete",
    async(id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.deletePhoto(id, token)

        //check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
)

//update a photo
export const updatePhoto = createAsyncThunk(
    "photo/update",
    async(photodata, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.updatePhoto({title: photodata.title}, photodata.id, token)

        //check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
)

//get a photo by id
export const getPhoto = createAsyncThunk(
    "photo/getphoto",
    async(id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.getPhoto(id, token)

        return data
    }
)

//like a photo
export const like = createAsyncThunk(
    "photo/like",
    async(id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.like(id, token)

        //check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    }
)

//add comment to a photo
export const comment = createAsyncThunk(
    "photo/comment",
    async(commentData, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.comment({comment: commentData.comment}, commentData.id, token)

        //check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
)

//get all photos
export const getPhotos = createAsyncThunk(
    "photo/getall",
    async(_, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.getPhotos(token)

        return data;
    }
)

//search photo by title
export const searchPhotos = createAsyncThunk(
    "photos/search",
    async(query, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await photoService.searchPhotos(query, token)

        return data
    }
)

export const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(publishPhoto.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(publishPhoto.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true
                state.photo = action.payload
                state.photos.unshift(state.photo)
                state.message = "Foto publicada com sucesso!"
            })
            .addCase(publishPhoto.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.photo = {}
            })
            .addCase(getUserPhotos.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getUserPhotos.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true
                state.photos = action.payload
            })
            .addCase(deletePhoto.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(deletePhoto.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true

                state.photos = state.photos.filter((photo) => {
                    return photo._id !== action.payload.id
                })

                state.message = action.payload.message
            })
            .addCase(deletePhoto.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.photo = {}
            })
            .addCase(updatePhoto.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(updatePhoto.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true

                state.photos.map((photo) => {
                    if(photo._id === action.payload.photo._id) {
                        return photo.title = action.payload.photo.title
                    }
                    return photo
                })

                state.message = action.payload.message
            })
            .addCase(updatePhoto.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.photo = {}
            })
            .addCase(getPhoto.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getPhoto.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true
                state.photo = action.payload
            })
            .addCase(like.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true

                if(state.photo.likes) {
                    state.photo.likes.push(action.payload.userId)
                }

                state.photos.map((photo) => {
                    if(photo._id === action.payload.photoId) {
                        return photo.likes.push(action.payload.userId)
                    }
                    return photo
                })

                state.message = action.payload.message
            })
            .addCase(like.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(comment.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true

                state.photo.comments.push(action.payload.comment)

                state.message = action.payload.message
            })
            .addCase(comment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getPhotos.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getPhotos.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true
                state.photos = action.payload
            })
            .addCase(searchPhotos.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(searchPhotos.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true
                state.photos = action.payload
            })
    }
})

export const {resetMessage} = photoSlice.actions
export default photoSlice.reducer