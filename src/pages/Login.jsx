import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { startOtpSend, otpSentSuccess, verifyOtpSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const schema = z.object({
  country: z
    .string()
    .min(1, "Please select a country")
    .length(2, "Invalid country code"), // IN, US, etc.
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must be less than 15 digits")
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit,formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: "IN", phone: "" }
  });

  const [countries, setCountries] = useState([]);
  const [dialMap, setDialMap] = useState({});
  const [otp, setOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");

  useEffect(() => {
    // fetch countries with dial codes
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd")
      .then(r => r.json())
      .then(data => {
        // build list of {cca2, name, dial}
        // console.log(data)
        const items = data.map(c => {
          const idd = c.idd || {};
          // some have idd.root and idd.suffixes
          let dial = "";
          if (idd?.root) {
            const sfx = (idd.suffixes && idd.suffixes[0]) || "";
            dial = `${idd.root}${sfx}`;
          }
          return { cca2: c.cca2, name: c.name.common, dial };
        }).filter(x => x.cca2);
        items.sort((a,b) => a.name.localeCompare(b.name));
        setCountries(items);
        const map = {};
        items.forEach(it => map[it.cca2] = it.dial || "");
        setDialMap(map);
      }).catch(()=>{ /* ignore network errs for now */ });
  }, []);

  const onSendOtp = (vals) => {
    dispatch(startOtpSend());
    toast.info("Sending OTP...");
    // simulate send
    setTimeout(() => {
      dispatch(otpSentSuccess());
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
    setOtp(newOtp);
      toast.success(`OTP sent. Use code ${newOtp}`);
      // store phone temporarily in localStorage for verify
      localStorage.setItem("pendingPhone", JSON.stringify({ country: vals.country, phone: vals.phone }));
      // show input to enter otp
    }, 1000);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    // shallow OTP verify simulation
    const pending = JSON.parse(localStorage.getItem("pendingPhone") || "null");
    if (!pending) return toast.error("No OTP request found");
    // in real app ask user to enter code; here we accept simulated code 1234
    if (otpValue ==otp) {
      const user = { phone: `${dialMap[pending.country] || ""}-${pending.phone}`, id: Date.now() };
      dispatch(verifyOtpSuccess(user));
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } else {
      toast.error("Invalid OTP.");
    }
  };

  // console.log(countries)
  return (
 <div className=" flex items-center justify-center 
                bg-gradient-to-br from-blue-100 via-white to-blue-50 
                dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 
                p-6">

  <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl 
                  bg-white/40 border border-white/30 shadow-2xl space-y-6 
                  transition-all custom-card-dark">

    {/* Heading */}
    <div className="text-center space-y-2">
      <div className="w-14 h-14 mx-auto rounded-2xl 
                      bg-gradient-to-br custom-btn-dark from-blue-500 to-blue-700 
                      flex items-center justify-center text-white shadow-lg">
        🔑
      </div>
      <h2 className="text-2xl font-bold text-slate-800 drop-shadow-sm custom-heading-dark">
        Login with OTP
      </h2>
      <p className="text-slate-500 text-sm custom-subtext-dark">
        Secure and quick authentication
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit(onSendOtp)} className="space-y-5">
      {
        otp?null:
      
     <> <div>
        
        <label className="block text-sm font-medium text-slate-700 mb-1 custom-heading-dark">
          Country
        </label>
        <select 
          {...register("country")} 
          className="mt-1 w-full rounded-xl border border-slate-200 
                     bg-white/60 px-4 py-2 text-slate-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-300 
                     custom-input-dark"
        >
          {countries.map(c => (
            <option key={c.cca2} value={c.cca2}>
              {c.name} {c.dial && `(${c.dial})`}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm mt-1" style={{color:'#ff6363'}}>{errors.country.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 custom-heading-dark">
          Phone
        </label>
        <input 
          {...register("phone")} 
          placeholder="9999999999"
          className="mt-1 w-full rounded-xl border border-slate-200 
                     bg-white/60 px-4 py-2 text-slate-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-300 
                     custom-input-dark"
        />
        {errors.phone  && <p className=" text-sm mt-1" style={{color:'#ff6363'}}>{errors.phone.message}</p>}
      </div>

      <div className="flex gap-3">
        <button 
          type="submit"
          className="flex-1 px-4 py-2 rounded-xl 
                     bg-gradient-to-r from-blue-500 to-blue-700 
                     text-white font-medium shadow-md hover:shadow-lg 
                     active:scale-95 transition-all custom-btn-primary-dark custom-btn-dark"
        >
          Send OTP
        </button>
       
       
      </div>
      </>
}

   

       {
          otp?
             <div className="flex gap-3">
               
        
        <input 
        type="text"
        onChange={(e)=>{
          setOtpValue(e.target.value)
        }}
          placeholder="Enter OTP"
          className="mt-1 w-full  rounded-xl border border-slate-200 
                     bg-white/60 px-4 py-2 text-slate-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-300 
                     custom-input-dark"
        />
      
           <button 
          onClick={verifyOtp} 
          type="button" 
          className="px-4 py-2 rounded-xl border border-slate-200 
                     bg-white/50 text-slate-700 
                     shadow-sm hover:shadow-md active:scale-95 
                     transition-all custom-btn-secondary-dark custom-btn-dark"
        >
          Verify
        </button>
         </div>:
        null
        }
       
    </form>
  </div>
</div>


  );
}
