import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, prependMessages, setLastAiResponseAt, removeMessage } from "../features/chat/chatSlice";
import { formatTime } from "../utils/formatDate";
import { toast } from "react-toastify";
import { isDesktop } from "react-device-detect";
import { BsSendFill } from "react-icons/bs";
import { IoArrowBackSharp } from "react-icons/io5";


export default function ChatRoomPage({ roomId , setActiveChat}) {
  const dispatch = useDispatch();
  const room = useSelector(s => s.chat.chatrooms.find(r => r.id === roomId));
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [room?.messages?.length]);

  if (!room) return <div className="p-4">Room not found.</div>;

 function scheduleAiReply(rid, incomingText) {
  const last = room.lastAiResponseAt || 0;
  const now = Date.now();
  const minGap = 2000; // Minimum 2s between replies
  const delay = 1200 + Math.random() * 1000; // Simulated AI thinking time
  const startDelay = Math.max(0, minGap - (now - last));

 const aiResponses = [
  text => `Hmm, "${text}" sounds interesting.`,
  text => `I see. "${text}" makes sense to me.`,
  text => `Got it — "${text}" sounds like a good point.`,
  text => `Let’s think about "${text}" for a moment.`,
  text => `"${text}" — That’s worth exploring further.`,
  text => `You might be onto something with "${text}".`,
  text => `That's an insightful thought about "${text}".`,
  text => `"${text}" could lead us somewhere interesting.`,
  text => `I appreciate your take on "${text}".`,
  text => `"${text}" is a fascinating idea.`,
  text => `Interesting perspective on "${text}".`,
  text => `Tell me more about "${text}".`,
  text => `"${text}" makes me curious.`,
  text => `I hadn't considered "${text}" that way.`,
  text => `Good point about "${text}".`
];

  setTimeout(() => {
    // Add typing indicator with unique ID
    const typingId = String(Date.now()) + "-typing";
    dispatch(
      addMessage({
        roomId: rid,
        message: {
          id: typingId,
          sender: "ai",
          text: "Gemini is typing...",
          ts: Date.now(),
          type: "typing"
        }
      })
    );

    setTimeout(() => {
      // Remove typing indicator
      dispatch(removeMessage({ roomId: rid, messageId: typingId }));

      // Pick a random natural reply
      const replyTemplate =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const replyText = replyTemplate(incomingText.slice(0, 120));

      // Add AI reply
      dispatch(
        addMessage({
          roomId: rid,
          message: {
            sender: "ai",
            text: replyText,
            ts: Date.now(),
            type: "text"
          }
        })
      );

      dispatch(setLastAiResponseAt({ roomId: rid, ts: Date.now() }));
    }, delay);
  }, startDelay);
}


  function onSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    dispatch(addMessage({ roomId, message: { sender: "user", text, ts: Date.now(), type: "text" } }));
    setInput("");
    scheduleAiReply(roomId, text);
  }

  function onImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
   const reader = new FileReader();
  reader.onloadend = () => {
    const base64Data = reader.result; // base64 string
    dispatch(
      addMessage({
        roomId,
        message: { sender: "user", text: base64Data, ts: Date.now(), type: "image" }
      })
    );
    scheduleAiReply(roomId, "[image]");
  };
  reader.readAsDataURL(file); // convert to base64
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text).then(() => toast.success("Copied"));
  }

function onScroll(e) {
  const el = e.target;
  
  if (el.scrollTop === 0) {
    const oldScrollHeight = el.scrollHeight; // before adding

    const older = Array.from({ length: 10 }).map((_, i) => ({
      id: `old-${Date.now()}-${i}`,
      sender: Math.random() > 0.5 ? "ai" : "user",
      text: "Older message " + (i + 1),
      ts: Date.now() - 1000 * (i + 60),
      type: "text"
    }));

    dispatch(prependMessages({ roomId, messages: older }));

    requestAnimationFrame(() => {
      const newScrollHeight = el.scrollHeight;
      el.scrollTop = newScrollHeight - oldScrollHeight;
    });
  }
}
  return (
  <div className="flex flex-col flex-1 w-full 
                bg-white/70 dark:bg-slate-800/50 
                backdrop-blur-xl  shadow-lg overflow-hidden custom-chat-dark">

  {/* Header */}
  <div className="p-4 chatRoomHeader border-b border-blue-100 dark:border-slate-700 
                  bg-white/80 dark:bg-slate-900/50 flex items-center  custom-header-dark">
                    {
        isDesktop?'':
         <IoArrowBackSharp size={28} className="mr-4"
         onClick={()=>{
          setActiveChat('')
         }}/>
      }
    <div>
      
     
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 custom-title-dark">{room.title}</h2>
      <div className="text-xs text-slate-500 dark:text-slate-400 custom-subtitle-dark">{room.messages.length} messages</div>
    </div>
  </div>

  {/* Messages */}
  <div
    ref={messagesRef}
    onScroll={onScroll}
    className="flex-1 overflow-auto p-5 space-y-4 
               bg-gradient-to-b from-blue-50/50 to-white 
               dark:from-slate-800/50 dark:to-slate-900 custom-msg-container-dark"
    style={{ maxHeight:isDesktop? "65dvh":'74dvh', minHeight: isDesktop? "65dvh":'74dvh'}}
  >
    {room.messages.map((m) => (
      <div
        key={m.id}
        className={`max-w-[75%] ${m.sender === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}
      >
        {m.type === "typing" ? (
          <div className="inline-block px-4 py-2 rounded-2xl 
                          bg-slate-200 dark:bg-slate-700 
                          text-slate-600 dark:text-slate-300 
                          italic animate-pulse shadow-sm custom-typing-dark">
            Gemini is typing...
          </div>
        ) : (
          <div
            className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
              m.sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white custom-user-msg-dark"
                : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 custom-ai-msg-dark"
            }`}
          >
            {m.type === "image" ? (
              <img src={m.text} alt="uploaded" className="max-w-sm rounded-lg shadow" />
            ) : (
              <span>{m.text}</span>
            )}
          </div>
        )}
        {m.type !== "typing" && (
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 custom-msg-meta-dark">
            {formatTime(m.ts)} •{" "}
            <button
              onClick={() => copyText(m.text)}
              className="underline hover:text-blue-500 dark:hover:text-blue-400 custom-copy-dark"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    ))}
  </div>

  {/* Input */}
  <form
    onSubmit={onSend}
    className={`p-4 border-t border-blue-100 dark:border-slate-700 
               bg-white/80 dark:bg-slate-900/50 flex gap-3 items-center custom-input-area-dark  ${ isDesktop?'': 'fixed bottom-0'} `}
               
  >
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 
                 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 
                 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 shadow-sm custom-input-dark"
    />
    <label className="cursor-pointer bg-blue-100 dark:bg-blue-900/50 
                      hover:bg-blue-200 dark:hover:bg-blue-800/50 
                      text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full 
                      shadow-sm transition custom-attach-dark">
      📎
      <input type="file" accept="image/*" onChange={onImage} className="hidden" />
    </label>
    <button
      type="submit"
      className={`${ isDesktop?'px-6': 'px-3'} py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                 text-white font-medium rounded-full shadow-md hover:shadow-lg 
                 active:scale-95 transition custom-btn-dark`
      }
    >
      {
        isDesktop?'Send': <BsSendFill />
      }
    
    </button>
  </form>
</div>

  );
}
