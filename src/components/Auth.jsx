import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import "@/styles/authpage.css";
import MascotLogo from "@/components/Logo";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/GetSupabaseClient";
import Cookies from "js-cookie";
import { generateUsername } from "friendly-username-generator";

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event == "SIGNED_IN") {
    const user = await supabase.auth.getUser();
    const { Username, fetch_error } = await supabase
      .from("user_data")
      .select("user_name")
      .eq("user_id", user["data"]["user"]["id"]);
    if (Username) {
      Cookies.set("id", user["data"]["user"]["id"]);
      Cookies.set("auth_status", user["data"]["user"]["role"]);
    } else {
      const options = {
        useHyphen: false,
      };
      const NewUsername = generateUsername(options);
      const { data, error } = await supabase
        .from("user_data")
        .insert([
          {
            user_id: user["data"]["user"]["id"],
            user_email: user["data"]["user"]["email"],
            user_name: NewUsername,
          },
        ]);
      Cookies.set("id", user["data"]["user"]["id"]);
      Cookies.set("auth_status", user["data"]["user"]["role"]);
    }
  }
});

function AuthenticationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("id") && Cookies.get("auth_status") == "authenticated") {
      navigate("/dashboard");
    }
  });
  return (
    <div className="grid-container">
      <motion.div
        className="typing-animation"
        animate={{ opacity: 1, y: 10 }}
        initial={{ opacity: 0, y: 1 }}
        transition={{ duration: 0.8, ease: "easeIn" }}
      >
        <TypeAnimation
          sequence={[
            "Wanna write ... ✍️  ?",
            1000,
            "Correct Grammar ... 🔍 ?",
            1000,
            "Be more creative ... 🧠 ?",
            1000,
            "👈 Try Copilot Today !",
            1100,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          style={{
            color: "#FFFFF0",
            fontSize: "3vw",
            display: "inline-block",
            width: "40vw",
          }}
        />
      </motion.div>
      <div className="left-side-shade"></div>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
      >
        <div className="auth-card">
          <Auth
            redirectTo="http://localhost:5173/dashboard"
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  backgroundColor: "#424949",
                  border: "black",
                },
                message: {
                  position: "fixed",
                  top: "0",
                  right: "0",
                  margin: "20px",
                  padding: "5px",
                  animation: "toastAnimation 0.5s ease forwards",
                },
              },
            }}
            theme="dark"
            providers={["google", "github"]}
          />
        </div>
      </motion.div>
      <img
        className="app-logo"
        src="./src/assets/copilot_mascot.png"
        alt="logo"
      ></img>
      <div className="app-name">Copilot</div>
      <MascotLogo />
    </div>
  );
}

export default AuthenticationPage;
