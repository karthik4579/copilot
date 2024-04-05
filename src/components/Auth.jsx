import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import "@/styles/authpage.css";
import  MascotLogo from "@/components/Logo";
import { TypeAnimation } from 'react-type-animation';
import { motion } from "framer-motion";
import "@fontsource/inter";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/GetSupabaseClient"

function AuthenticationPage () {
  
  async function isUserLoggedIn() {
    const user = await supabase.auth.getUser();
    if (user) {
      if (user["data"]["user"]["role"] == "authenticated") {
        return true;
      }
      else {
      return false;
    }
  }
  }

  async function UserAuthCheck(){     
    const navigate = useNavigate();
    const status = await isUserLoggedIn();
    console.log(status)
    if (status == true) {
         navigate('/dashboard');
         console.log("navigated to dashboard")
    }
  }
UserAuthCheck()
  return(
  <div class ="grid-container">
    <motion.div className="typing-animation" animate={{ opacity: 1, y: 10 }}
    initial={{ opacity: 0, y: 1 }}
    transition={{ duration: 0.8, ease: "easeIn" }}>
    <TypeAnimation
  sequence={[
    'Wanna write ... ✍️  ?',
    1000, 
    'Correct Grammar ... 🔍 ?',
    1000,
    'Be more creative ... 🧠 ?',
    1000,
    '👈 Try Copilot Today !',
    1100
  ]}
  wrapper="span"
  cursor={true}
  repeat={Infinity}
  style={{color: '#FFFFF0', fontSize: '3vw', display: 'inline-block', width: '40vw'}}
  />
  </motion.div>
  <div class="left-side-shade"></div>
  <motion.div animate={{ opacity: 1, scale: 1 }}
  initial={{ opacity: 0, scale: 0 }}
  transition={{ duration: 0.7, ease: "easeIn" }}>
  <div className="auth-card">
  <Auth
    supabaseClient={supabase}
    appearance={{
      theme: ThemeSupa,
      style:{
        message: {
          'position': 'fixed',
          'top':'0',
          'right':'0',
          'margin':'20px',
          'padding':'5px',
          'animation': 'toastAnimation 0.5s ease forwards'
        }
      }
    }}
    theme='dark'
    redirectTo='http://localhost:5173/dashboard'
    providers={["google", "facebook"]}
  />
  </div>
  </motion.div>
  <img class="app-logo" src="./src/assets/copilot_mascot.png" alt="logo"></img>
  <div class="app-name">Copilot</div>
  <MascotLogo />
  </div>
);
}

export default AuthenticationPage;