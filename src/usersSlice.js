import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async to fetch users from API
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false, error: "" },
  reducers: {
    addUser: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateUser: (state, action) => {
      const idx = state.list.findIndex(u => u.id === action.payload.id);
      if (idx >= 0) {
        state.list[idx] = {
          ...state.list[idx],
          ...action.payload,
          company: {
            ...state.list[idx].company,
            ...action.payload.company
          }
        };
      }
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter(u => u.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, state => {
        state.error = "Failed to fetch users";
        state.loading = false;
      });
  }
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
