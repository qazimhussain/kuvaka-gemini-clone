import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";
import { BsSun, BsMoon } from "react-icons/bs";
import { isDesktop } from "react-device-detect";
export default function NavBar() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  function onLogout() {
    const isLogout=confirm('Are you sure you want to Logout?')

    if(isLogout)
    {
    dispatch(logout());
    navigate("/");
    }
  }

  return (
<nav
  className={`sticky top-0 z-50 border-b border-white/20 
              bg-gradient-to-r from-blue-200/40 via-white/30 to-blue-100/40 
              backdrop-blur-2xl shadow custom-navbar-dark`}
>
  <div className="max-w-8xl mx-auto px-6 py-3 flex items-center justify-between">
   <Link to="/dashboard" className="flex logo items-center custom-text-dark gap-3 font-extrabold text-xl tracking-tight custom-text">
      <div className="w-10 h-10 md:mr-0 mr-3 flex items-center  custom-btn-dark justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
        G
      </div>
      {
        isDesktop?'Gemini Clone':''
      }
      
    </Link>

    <div className="flex items-center gap-4">
    <button
  onClick={() => dispatch(toggleTheme())}
  className="p-2 rounded-full bg-white/50 text-slate-800 shadow-sm hover:shadow-md hover:scale-105 
             transition-all custom-glass-dark custom-icon-dark"
>
  {theme === "light" ? <BsMoon size={18} /> : <BsSun size={18} />}
</button>


      {user ? (
        <>
          <div className="text-sm font-medium text-slate-700 custom-text-dark">
            {user.phone}
          </div>
          <button onClick={onLogout} className="px-4 py-2 rounded-xl 
                       bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white font-medium shadow-lg hover:shadow-xl 
                       active:scale-95 transition-all custom-btn-dark">
            Logout
          </button>
        </>
      ) : (
        <Link to="/" className="px-4 py-2 rounded-xl 
                     bg-gradient-to-r from-blue-500 to-blue-600 
                     text-white font-medium shadow-lg hover:shadow-xl 
                     active:scale-95 transition-all custom-btn-dark">
          Login
        </Link>
      )}
    </div>
  </div>
</nav>







  );
}
