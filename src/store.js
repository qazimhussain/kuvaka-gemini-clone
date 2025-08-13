import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import chatReducer from "./features/chat/chatSlice";
import chatroomsReducer from "./store/chatroomsSlice";
import themeReducer from "./features/theme/themeSlice";
/* basic localStorage persistence */
const persistedState = JSON.parse(localStorage.getItem("gemini_state") || "{}");

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    theme: themeReducer,
    chatrooms: chatroomsReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  const state = store.getState();
  // persist minimal parts
  const toPersist = {
    auth: state.auth,
    chat: {
      chatrooms: state.chat.chatrooms,
      activeRoomId: state.chat.activeRoomId,
    },
    ui: state.ui,
  };
  localStorage.setItem("gemini_state", JSON.stringify(toPersist));
});
