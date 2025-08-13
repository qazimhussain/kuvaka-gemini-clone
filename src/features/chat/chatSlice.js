import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatrooms: [
    // example seed (can be empty)
    // { id: "r1", title: "General", messages: [ {id:'m1', sender:'user'|'ai', text, ts, type:'text'|'image'} ], lastAiResponseAt: 0 }
  ],
  activeRoomId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createRoom(state, action) {
      const room = { id: String(Date.now()), title: action.payload, messages: [], lastAiResponseAt: 0 };
      state.chatrooms.unshift(room);
    },
    deleteRoom(state, action) {
      state.chatrooms = state.chatrooms.filter(r => r.id !== action.payload);
      if (state.activeRoomId === action.payload) state.activeRoomId = null;
    },
    setActiveRoom(state, action) {
      state.activeRoomId = action.payload;
    },
    addMessage(state, action) {
      const { roomId, message } = action.payload;
      const room = state.chatrooms.find(r => r.id === roomId);
      if (room) {
        room.messages.push({ id: String(Date.now()) + Math.random(), ...message });
      }
    },
    prependMessages(state, action) {
      const { roomId, messages } = action.payload;
      const room = state.chatrooms.find(r => r.id === roomId);
      if (room) {
        room.messages = [...messages, ...room.messages];
      }
    },
    setLastAiResponseAt(state, action) {
      const { roomId, ts } = action.payload;
      const room = state.chatrooms.find(r => r.id === roomId);
      if (room) room.lastAiResponseAt = ts;
    },
    removeMessage(state, action) {
      const { roomId, messageId } = action.payload;
      const room = state.chatrooms.find(r => r.id === roomId);
      if (room) {
        room.messages = room.messages.filter(m => m.id !== messageId);
      }
    }
  }
});

export const { createRoom, deleteRoom, setActiveRoom, addMessage, prependMessages, setLastAiResponseAt,removeMessage } = chatSlice.actions;
export default chatSlice.reducer;
