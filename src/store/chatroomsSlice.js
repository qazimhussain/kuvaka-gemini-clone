import { createSlice } from "@reduxjs/toolkit";

const chatroomsSlice = createSlice({
  name: "chatrooms",
  initialState: [],
  reducers: {
    addChatroom: (state, action) => {
      state.push({
        id: Date.now(),
        name: action.payload,
      });
    },
    deleteChatroom: (state, action) => {
      return state.filter((room) => room.id !== action.payload);
    },
    
  },
});

export const { addChatroom, deleteChatroom } = chatroomsSlice.actions;
export default chatroomsSlice.reducer;
