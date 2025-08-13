# ​ Kuvaka Gemini Clone

A **modern Gemini AI chat clone** built with React (Vite), TailwindCSS v4, Redux, and more!  
**Live Demo:** [https://kuvaka-gemini-clone.vercel.app](https://kuvaka-gemini-clone.vercel.app)

---

##  Project Overview

An interactive AI chat simulator with a luxurious glassmorphic UI, featuring:
- OTP login with country code and validation
- Chatroom creation, search, and deletion
- AI-simulated replies with simulated 'typing...' indicator
- Infinite scroll, reverse pagination, and throttling
- Image uploads, copy-to-clipboard, and dark/light mode
- Responsive layout designed with modern aesthetics



##  Setup & Run Instructions

Clone the project:
```bash
git clone https://github.com/your-username/kuvaka-gemini-clone.git
cd kuvaka-gemini-clone

Install dependencies:
npm install

Run dev server:
npm run dev

##  Folder & Component Structure

src/
├── assets/ # Static assets like logos, SVGs
│ └── react.svg
│
├── components/ # Reusable UI components
│ └── NavBar.jsx
│
├── features/ # Redux slices for state management
│ ├── auth/
│ │ └── authSlice.js # Authentication state & actions
│ ├── chat/
│ │ └── chatSlice.js # Chat messages state
│ └── theme/
│ └── themeSlice.js # Dark/Light theme state
│
├── pages/ # Main pages
│ ├── ChatRoom.jsx # Chatroom page with messages
│ ├── Dashboard.jsx # Chatrooms list and navigation
│ └── Login.jsx # OTP login page
│
├── store/ # Redux store setup
│ ├── chatroomsSlice.js # Chatrooms state & CRUD logic
│ └── store.js
│
├── styles/ # Global styles
│ └── index.css
│
├── utils/ # Helper functions
│ ├── formatDate.js # Format timestamps
│ └── persistor.js # Redux persist configuration
│
├── App.jsx # Main app component with routes
├── index.jsx # React entry point
└── tailwind.config.js # Tailwind configuration


##  Implementation Details

Throttling:
Simulates AI typing with controlled timeouts
Ensures responses are delayed appropriately to look natural

Pagination & Infinite Scroll:
Messages load in reverse via Redux prependMessages
Scroll to top triggers older message loading without jump

Form Validation:
Login form validated using React Hook Form + Zod
Country selection and phone number input MUST be valid

Image Upload Persistence:
Images are converted to Base64 via FileReader for persistence even after app reloads

Additional Features:
Copy any message to clipboard
Dark and light themes with custom glass-style overrides
Chatroom create/delete and search with debouncing








