'use client'
import { motion } from "framer-motion"
import Link from "next/link"

const BaseButtonStyles = "relative inline-flex items-center justify-center rounded-lg overflow-hidden group"

// Animaciones base reutilizables
const buttonAnimations = {
  initial: { scale: 1, y: 0 },
  tap: { scale: 0.95 },
  hover: { scale: 1.02, y: -2 },
  transition: { type: "spring", stiffness: 400, damping: 10 }
}

const overlayAnimation = {
  initial: { opacity: 0 },
  hover: { opacity: 0.1 },
  transition: { duration: 0.3 }
}

const PrimaryButton = ({ children, href = "#", ...props }) => (
  <motion.div whileHover="hover" whileTap="tap" initial="initial">
    <Link
      href={href}
      className={`${BaseButtonStyles} px-6 py-3 text-lg font-bold text-white bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/30 dark:shadow-blue-600/20`}
      {...props}
    >
      <motion.span 
        className="absolute inset-0 bg-white/10"
        variants={overlayAnimation}
      />
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        variants={buttonAnimations}
      >
        {children}
      </motion.span>
    </Link>
  </motion.div>
)

const SecondaryButton = ({ children, href = "#", ...props }) => (
  <motion.div whileHover="hover" whileTap="tap" initial="initial">
    <Link
      href={href}
      className={`${BaseButtonStyles} px-6 py-3 text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 shadow-sm hover:shadow-md shadow-blue-300/30 dark:shadow-blue-700/20 border border-blue-600 dark:border-blue-400`}
      {...props}
    >
      <motion.span 
        className="absolute inset-0 bg-white/10"
        variants={overlayAnimation}
      />
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        variants={buttonAnimations}
      >
        {children}
      </motion.span>
    </Link>
  </motion.div>
)

const TertiaryButton = ({ children, href = "#", ...props }) => (
  <motion.div whileHover="hover" whileTap="tap" initial="initial">
    <Link
      href={href}
      className={`${BaseButtonStyles} px-4 py-2 text-md text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800`}
      {...props}
    >
      <motion.span 
        className="absolute inset-0 bg-white/10"
        variants={overlayAnimation}
      />
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        variants={{
          ...buttonAnimations,
          hover: { ...buttonAnimations.hover, y: -1 } // Efecto más sutil
        }}
      >
        {children}
      </motion.span>
    </Link>
  </motion.div>
)

const AcceptButton = ({ children, href = "#", ...props }) => (
  <motion.div 
    whileHover="hover" 
    whileTap="tap" 
    initial="initial"
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <Link
      href={href}
      className={`${BaseButtonStyles} px-6 py-3 text-lg font-bold text-white bg-gradient-to-br from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 shadow-md hover:shadow-lg shadow-green-500/30 dark:shadow-green-600/20`}
      {...props}
    >
      <motion.span 
        className="absolute inset-0 bg-white/10"
        variants={overlayAnimation}
      />
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        variants={{
          ...buttonAnimations,
          hover: { ...buttonAnimations.hover, y: -3, rotate: 0.5 } // Pequeño giro al hacer hover
        }}
      >
        {children}
      </motion.span>
    </Link>
  </motion.div>
)

const DenyButton = ({ children, href = "#", ...props }) => (
  <motion.div 
    whileHover={{ 
      scale: 1.02, 
      y: -3,
      transition: { type: "spring", bounce: 0.5 }
    }} 
    whileTap={{ scale: 0.95 }}
  >
    <Link
      href={href}
      className={`${BaseButtonStyles} px-6 py-3 text-lg font-bold text-white bg-gradient-to-br from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 shadow-md hover:shadow-lg shadow-red-500/30 dark:shadow-red-600/20`}
      {...props}
    >
      <motion.span 
        className="absolute inset-0 bg-white/10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.15 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        whileHover={{ x: [0, -1, 1, 0] }} // Pequeño temblor al hacer hover
      >
        {children}
      </motion.span>
    </Link>
  </motion.div>
)

export default PrimaryButton
export { SecondaryButton, TertiaryButton, AcceptButton, DenyButton }