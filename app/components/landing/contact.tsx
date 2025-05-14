'use client'
import { motion } from "framer-motion"
import { FaFacebook, FaInstagram, FaWhatsapp, FaXTwitter } from "react-icons/fa6"

const Contact = () => {
  // Animación simplificada y confiable
  const iconAnimation = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: 10,
      transition: { type: "spring", stiffness: 300 }
    }
  }

  return (
    <div className="flex flex-row items-center">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl px-4">
        {[
          { icon: <FaXTwitter />, color: "text-blue-500"},
          { icon: <FaFacebook />, color: "text-blue-600"},
          { icon: <FaInstagram />, color: "text-pink-500"},
          { icon: <FaWhatsapp />, color: "text-green-500"}
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.a
              href="#"
              variants={iconAnimation}
              initial="rest"
              whileHover="hover"
              className={`text-2xl ${item.color} hover:opacity-90`}
            >
              {item.icon}
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Contact