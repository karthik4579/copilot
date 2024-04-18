import { motion } from 'framer-motion';
import "@/styles/logo.css";

function MascotLogo (){
  return(
  <motion.img
    src="./src/assets/copilot_mascot.png"
    alt="Mascot"
    animate={{ opacity: 1, y: 10 }}
    initial={{ opacity: 0, y: 0 }}
    transition={{ duration: 0.8, ease: "easeIn" }}
    className='mascot-logo'
  />
  );
}

export default MascotLogo;