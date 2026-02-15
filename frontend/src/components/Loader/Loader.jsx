import React from "react";
import { motion } from "framer-motion";

const Loader = ({ fullScreen = true, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : "h-32"
      } ${className}`}
    >
      <motion.div
        className="relative w-16 h-16"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 1, 0], rotate: [0, 360, 360, 720] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-[#80db66] rounded-full shadow-lg"
            initial={{ opacity: 0.3, scale: 0.5 }}
            animate={{
              opacity: [0.3, 1, 1, 0.3],
              scale: [0.5, 1.2, 1.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            style={{
              top: `${i % 2 === 0 ? "10%" : "65%"}`,
              left: `${i < 2 ? "10%" : "65%"}`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loader;
