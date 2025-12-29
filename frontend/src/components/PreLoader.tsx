import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PreLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          {/* Curtain Effect */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(20, 184, 166, 0.05)",
              transformOrigin: "center",
            }}
          />

          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              opacity: { delay: 0.2 },
            }}
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.h1
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Vahan Bazar
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                height: 4,
                background: "linear-gradient(90deg, #14b8a6, transparent)",
                marginTop: 12,
                borderRadius: 2,
              }}
            />
          </motion.div>

          {/* Pulse Effect */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "2px solid #14b8a6",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreLoader;
