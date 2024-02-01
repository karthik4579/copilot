import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import "@/styles/authpage.css";
import { MascotLogo } from "@/components/Logo";
import { TypeAnimation } from 'react-type-animation';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthenticationPage = () => (
  <div class ="main-container">
    <MascotLogo />
    <div class="typing-animation">
    <TypeAnimation
  sequence={[
    'Hello there, i\'m Copilot 👋',
    1000, 
    'I can help you with your grammatical mistakes ✍️',
    1000,
    'I can help you be more creative 🧠',
    1000,
    '👈 Signup here to get started ! '
  ]}
  wrapper="span"
  cursor={true}
  repeat={Infinity}
  style={{color: '#FFFFF0', fontSize: '2em', display: 'inline-block' }}
  />
  </div>
  <div class="auth-card-container">
  <div class="auth-card">
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme='dark'
    providers={["google", "facebook"]}
  />
  </div>
  </div>
  </div>
);

export default AuthenticationPage;
