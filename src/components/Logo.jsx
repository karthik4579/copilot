import React from 'react';
import { motion } from 'framer-motion';

function MascotLogo (){
  return(
  <motion.img
    src="@/assets/mascot.png"
    alt="Image"
    animate={{ opacity: 1, y: 10 }}
    initial={{ opacity: 0, y: 0 }}
    transition={{ duration: 0.5, ease: "easeIn" }}
  />
  );
}

export default MascotLogo;