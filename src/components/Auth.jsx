import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import "@/styles/authpage.css";
import  MascotLogo from "@/components/Logo";
import { TypeAnimation } from 'react-type-animation';
import { motion } from "framer-motion";
import "@fontsource/inter";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthenticationPage = () => (
  <div class ="grid-container">
    <motion.div className="typing-animation" animate={{ opacity: 1, y: 10 }}
    initial={{ opacity: 0, y: 1 }}
    transition={{ duration: 0.8, ease: "easeIn" }}>
    <TypeAnimation
  sequence={[
    'Hello there, i\'m Copilot 👋',
    1000, 
    'I can help you with your grammatical mistakes ✍️',
    1000,
    'I can help you be more creative 🧠',
    1000,
    '👈 Signup here to get started !',
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
  <div class="auth-card">
  <Auth
    supabaseClient={supabase}
    appearance={{
      theme: ThemeSupa,
    }}
    theme='dark'
    providers={["google", "facebook"]}
  />
  </div>
  </motion.div>
  <img class="app-logo" src="./src/assets/copilot_mascot.png" alt="logo"></img>
  <div class="app-name">Copilot</div>
  <MascotLogo />
  </div>
);


export default AuthenticationPage;