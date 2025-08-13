import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createRoom, deleteRoom, setActiveRoom } from "../features/chat/chatSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChatRoomPage from "./ChatRoom";
import { FiTrash2 } from "react-icons/fi";
import { isDesktop } from "react-device-detect";
export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatrooms = useSelector(s => s.chat.chatrooms || []);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [addingChat, setAddingChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState("");
  const [chatroomName, setChatroomName] = useState("");
const [newChatTitle, setNewChatTitle] = useState("");
  const onCreateChat = (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;
    dispatch(createRoom(newChatTitle.trim())); // adds at top
    setNewChatTitle("");
    setAddingChat(false);
    // Set active to the newly created room (which will be at index 0)
    dispatch(setActiveRoom(chatrooms[0]?.id));
  };

  useEffect(()=>{
    setTimeout(()=>{
    setIsLoading(false)

    },3000)
  },[])
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return chatrooms;
    return chatrooms.filter(r => r.title.toLowerCase().includes(q));
  }, [chatrooms, query]);

  function onCreate() {
    if (!title.trim()) return toast.error("Enter a title");
    dispatch(createRoom(title.trim()));
    toast.success("Chatroom created");
    setTitle("");
  }

  function onDelete(id) {
    if (!confirm("Delete this chatroom?")) return;
    dispatch(deleteRoom(id));
    toast.info("Chatroom deleted");
  }

  function openRoom(id) {
    dispatch(setActiveRoom(id));
    navigate(`/chat/${id}`);
  }

  return (
<div className=" bg-gradient-to-br from-white via-blue-50 to-blue-100 flex">
  {/* Sidebar */}

  {
    !isDesktop && activeChat?
    null
  :
<aside className={`md:w-80 w-100 ${!isDesktop?'flex-1':''}  bg-white/80 dark:bg-slate-800/50 backdrop-blur-2xl border-r border-blue-100 dark:border-slate-700 flex flex-col custom-sidebar-dark`}>
  {/* Header */}
  <div className="p-4 border-b border-blue-100 dark:border-slate-700 flex items-center justify-between">
    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Chatrooms</h2>
    <button
      onClick={() => setAddingChat(true)}
      className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow hover:shadow-lg active:scale-95 transition custom-btn-dark"
    >
      + New
    </button>
  </div>

  {/* New Chat Form */}
  {addingChat && (
    <form
      onSubmit={onCreateChat}
      className="flex gap-2 px-4 py-2 border-b border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-700/40"
    >
      <input
        value={newChatTitle}
        onChange={(e) => setNewChatTitle(e.target.value)}
        placeholder="Enter chat title"
        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
        autoFocus
      />
      <button
        type="submit"
        className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow hover:shadow-lg active:scale-95 transition custom-btn-dark"
      >
        Create
      </button>
    </form>
  )}

  {/* Search */}
  <div className="px-4 py-3 border-b border-blue-100 dark:border-slate-700">
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search chatrooms..."
      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 shadow-sm"
    />
  </div>

  {/* Chat List */}
  <div
    className="flex-1 overflow-y-auto p-4 space-y-3"
    style={{ maxHeight:isDesktop? "68dvh":'80dvh', minHeight: isDesktop? "68dvh":'80dvh' }}
  >
    {isLoading ? (
      Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-md animate-pulse"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5"></div>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/3"></div>
        </div>
      ))
    ) : filtered.length === 0 ? (
      <div className="text-sm text-slate-500 dark:text-slate-400 italic">No chatrooms yet.</div>
    ) : (
      filtered.map((r) => (
        <div
          key={r.id}
          onClick={() => dispatch(setActiveChat(r.id))}
          className={`p-4 rounded-xl border bg-white dark:bg-slate-800 cursor-pointer transition-all duration-300 ${
            activeChat === r.id
              ? "bg-gradient-to-br from-sky-100 via-sky-50 to-white dark:from-blue-900/30 dark:via-slate-800/50 dark:to-slate-900 border border-sky-300 dark:border-blue-700 shadow-lg scale-[1.01] activeChat"
              : "border-slate-200 dark:border-slate-600 shadow-md hover:border-sky-300 dark:hover:border-blue-700 hover:shadow-lg"
          }`}
        >
          <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            <div className="flex items-center justify-between">
              {r.title}
              <FiTrash2
                className="w-4 h-4 text-red-500 hover:text-red-700 transition dark-red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(r.id);
                }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {(r.messages?.length || 0)} messages
          </div>
        </div>
      ))
    )}
  </div>
</aside>
}



  {/* Chat Window */}
  {
    isDesktop || activeChat?
    <main className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl">
    {activeChat ? (
      <ChatRoomPage roomId={activeChat} setActiveChat={setActiveChat}/>
    ) : (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a chatroom to start messaging
      </div>
    )}
  </main>:null
  }
  
</div>







  );
}
