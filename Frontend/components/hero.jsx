"use client";
import React from 'react';
import { Button } from "components/ui/button";
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
// Motion variants for smooth animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Hero() {
  return (
    <motion.div initial="hidden" animate="visible" className="bg-gradient-to-r from-purple-500 to-purple-600 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center">
        
        {/* Left Side */}
        <motion.div variants={staggerContainer} className="lg:w-1/2">
          <motion.h1 variants={fadeInUp} className="text-4xl font-bold text-white leading-tight sm:text-5xl md:text-6xl mb-4">
            Build, Train, and Manage Effortlessly
            <motion.span variants={fadeInUp} className="block text-gradient">with QuickStart AI</motion.span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-3 text-lg text-gray-200 md:max-w-lg">
            Create a superior chat experience for your website with QuickStart AI. Manage and train your data with ease.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-5">
            <Button className="px-6 py-3 text-lg font-medium text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800 transition">
              BUILD YOUR WORLD
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Side with Image */}
        <motion.div variants={fadeInUp} className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            whileHover={{ scale: 1.05 }} 
          >
            <img src="/Cute.png" alt="Descriptive Alt Text" className="max-w-full rounded-lg " />
          </motion.div>
        </motion.div>
      </div>

    </motion.div>
  );
}
