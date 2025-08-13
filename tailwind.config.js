/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',   // ensure class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  // optional safelist (only if you still see classes missing)
  // safelist: [
  //   'from-blue-200/[0.4]', 'via-white/[0.3]', 'to-blue-100/[0.4]',
  //   'dark:from-slate-800/[0.4]', 'dark:via-slate-900/[0.3]', 'dark:to-slate-800/[0.4]'
  // ],
};
